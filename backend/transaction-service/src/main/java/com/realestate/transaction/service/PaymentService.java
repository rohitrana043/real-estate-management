package com.realestate.transaction.service;

import com.realestate.transaction.dto.PaymentDTO;
import com.realestate.transaction.dto.RefundDTO;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentService {
    PaymentDTO initiatePayment(Long transactionId, PaymentDTO paymentDTO);
    PaymentDTO processPayment(String paymentReference);
    PaymentDTO getPaymentStatus(String paymentReference);
    List<PaymentDTO> getTransactionPayments(Long transactionId);
    PaymentDTO refundPayment(String paymentReference, BigDecimal amount);
    RefundDTO getRefundDetails(String refundId);
    List<RefundDTO> getPaymentRefunds(String paymentReference);
    RefundDTO syncRefundStatus(String refundId);
}