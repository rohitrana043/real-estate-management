package com.realestate.transaction.service;

import com.realestate.transaction.model.*;
import com.realestate.transaction.repository.*;
import com.realestate.transaction.dto.*;
import com.stripe.model.PaymentIntent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final TransactionRepository transactionRepository;
    private final StripeService stripeService;

    @Override
    @Transactional
    public PaymentDTO initiatePayment(Long transactionId, PaymentDTO paymentDTO) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        validatePaymentAmount(transaction, paymentDTO.getAmount());

        // Create Stripe PaymentIntent
        PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                paymentDTO.getAmount(),
                "usd" // or your preferred currency
        );

        Payment payment = new Payment();
        payment.setTransaction(transaction);
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(PaymentMethod.valueOf(paymentDTO.getPaymentMethod()));
        payment.setPaymentReference(paymentIntent.getId());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        PaymentDTO response = convertToDTO(savedPayment);
        response.setClientSecret(paymentIntent.getClientSecret());
        return response;
    }

    @Override
    @Transactional
    public PaymentDTO processPayment(String paymentReference) {
        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(paymentReference);

        PaymentStatus newStatus = mapStripeStatus(paymentIntent.getStatus());
        payment.setStatus(newStatus);

        if (newStatus == PaymentStatus.COMPLETED) {
            updateTransactionStatus(payment.getTransaction(), TransactionStatus.PAYMENT_COMPLETED);
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return convertToDTO(updatedPayment);
    }

    @Override
    @Transactional
    public PaymentDTO refundPayment(String paymentReference, BigDecimal amount) {
        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Validate refund amount
        if (amount.compareTo(payment.getAmount()) > 0) {
            throw new RuntimeException("Refund amount cannot be greater than payment amount");
        }

        try {
            // Process refund with Stripe
            com.stripe.model.Refund stripeRefund = stripeService.createRefund(
                    paymentReference,
                    amount.multiply(new BigDecimal("100")).longValue()
            );

            // If Stripe refund is successful, create local refund record
            if ("succeeded".equals(stripeRefund.getStatus())) {
                // Create local refund record
                Refund localRefund = new Refund();
                localRefund.setPayment(payment);
                localRefund.setRefundId(stripeRefund.getId());
                localRefund.setAmount(amount);
                localRefund.setStatus(stripeRefund.getStatus());
                localRefund.setReason(stripeRefund.getReason());
                localRefund.setRefundDate(LocalDateTime.now());

                // Save local refund
                refundRepository.save(localRefund);

                // Update payment status
                payment.setStatus(PaymentStatus.REFUNDED);
                Payment updatedPayment = paymentRepository.save(payment);

                // Return updated payment info
                return convertToDTO(updatedPayment);
            }

            throw new RuntimeException("Refund processing failed with status: " + stripeRefund.getStatus());
        } catch (Exception e) {
            throw new RuntimeException("Error processing refund: " + e.getMessage());
        }
    }

    @Transactional
    public RefundDTO syncRefundStatus(String refundId) {
        Refund localRefund = refundRepository.findByRefundId(refundId)
                .orElseThrow(() -> new RuntimeException("Refund not found"));

        try {
            // Retrieve latest status from Stripe
            com.stripe.model.Refund stripeRefund = com.stripe.model.Refund.retrieve(refundId);

            // Update local refund status
            localRefund.setStatus(stripeRefund.getStatus());
            Refund updatedRefund = refundRepository.save(localRefund);

            return convertToRefundDTO(updatedRefund);
        } catch (Exception e) {
            throw new RuntimeException("Error syncing refund status: " + e.getMessage());
        }
    }

    private PaymentStatus mapStripeStatus(String stripeStatus) {
        return switch (stripeStatus) {
            case "succeeded" -> PaymentStatus.COMPLETED;
            case "processing" -> PaymentStatus.PROCESSING;
            case "requires_payment_method", "requires_confirmation", "requires_action" -> PaymentStatus.PENDING;
            default -> PaymentStatus.FAILED;
        };
    }

    private void validatePaymentAmount(Transaction transaction, BigDecimal paymentAmount) {
        BigDecimal totalPaidAmount = transaction.getPayments().stream()
                .filter(p -> p.getStatus() == PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remainingAmount = transaction.getAmount().subtract(totalPaidAmount);
        if (paymentAmount.compareTo(remainingAmount) > 0) {
            throw new RuntimeException("Payment amount exceeds remaining transaction amount");
        }
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentReference(payment.getPaymentReference());
        dto.setStripePaymentIntentId(payment.getStripePaymentIntentId());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus().name());
        dto.setPaymentMethod(payment.getPaymentMethod().name());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setClientSecret(payment.getClientSecret());
        return dto;
    }

    private RefundDTO convertToRefundDTO(Refund refund) {
        RefundDTO dto = new RefundDTO();
        dto.setRefundId(refund.getRefundId());
        dto.setPaymentReference(refund.getPayment().getPaymentReference());
        dto.setAmount(refund.getAmount());
        dto.setStatus(refund.getStatus());
        dto.setRefundDate(refund.getRefundDate());
        dto.setReason(refund.getReason());
        return dto;
    }

    private void updateTransactionStatus(Transaction transaction, TransactionStatus newStatus) {
        // Check if all payments are completed
        boolean allPaymentsCompleted = transaction.getPayments().stream()
                .allMatch(p -> p.getStatus() == PaymentStatus.COMPLETED);

        if (allPaymentsCompleted) {
            BigDecimal totalPaid = transaction.getPayments().stream()
                    .map(Payment::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Update transaction status only if full amount is paid
            if (totalPaid.compareTo(transaction.getAmount()) >= 0) {
                transaction.setStatus(newStatus);
                transactionRepository.save(transaction);
            }
        }
    }

    @Override
    @Transactional
    public RefundDTO getRefundDetails(String refundId) {
        Refund refund = refundRepository.findByRefundId(refundId)
                .orElseThrow(() -> new RuntimeException("Refund not found"));
        return convertToRefundDTO(refund);
    }

    @Override
    public List<RefundDTO> getPaymentRefunds(String paymentReference) {
        Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Make sure we're using the correct Refund class from our model
        List<Refund> refunds = payment.getRefunds();
        return refunds.stream()
                .map(this::convertToRefundDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentDTO getPaymentStatus(String paymentReference) {
        try {
            // First, find the payment in our database
            Payment payment = paymentRepository.findByPaymentReference(paymentReference)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            // Get latest status from Stripe
            PaymentIntent paymentIntent = stripeService.retrievePaymentIntent(payment.getStripePaymentIntentId());

            // Update local payment status if it's different
            PaymentStatus newStatus = mapStripeStatus(paymentIntent.getStatus());
            if (payment.getStatus() != newStatus) {
                payment.setStatus(newStatus);
                payment = paymentRepository.save(payment);

                // If payment is completed, update transaction status
                if (newStatus == PaymentStatus.COMPLETED) {
                    updateTransactionStatus(payment.getTransaction(), TransactionStatus.PAYMENT_COMPLETED);
                }
            }

            return convertToDTO(payment);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving payment status: " + e.getMessage());
        }
    }

    @Override
    public List<PaymentDTO> getTransactionPayments(Long transactionId) {
        // First verify that the transaction exists
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));

        // Get all payments for the transaction
        List<Payment> payments = paymentRepository.findByTransactionId(transactionId);

        // Convert to DTOs
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

}