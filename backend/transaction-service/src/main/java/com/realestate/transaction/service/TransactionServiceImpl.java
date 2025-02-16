package com.realestate.transaction.service;

import com.realestate.transaction.model.*;
import com.realestate.transaction.repository.*;
import com.realestate.transaction.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setPropertyId(dto.getPropertyId());
        transaction.setBuyerId(dto.getBuyerId());
        transaction.setSellerId(dto.getSellerId());
        transaction.setAmount(dto.getAmount());
        transaction.setTransactionNumber(generateTransactionNumber());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    @Override
    public TransactionDTO getTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return convertToDTO(transaction);
    }

    @Override
    public List<TransactionDTO> getTransactionsByBuyer(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsBySeller(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransactionDTO updateTransactionStatus(Long id, String status) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(TransactionStatus.valueOf(status));
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    private String generateTransactionNumber() {
        return "TXN" + System.currentTimeMillis();
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setTransactionNumber(transaction.getTransactionNumber());
        dto.setPropertyId(transaction.getPropertyId());
        dto.setBuyerId(transaction.getBuyerId());
        dto.setSellerId(transaction.getSellerId());
        dto.setAmount(transaction.getAmount());
        dto.setStatus(transaction.getStatus().name());
        dto.setCreatedAt(transaction.getCreatedAt());

        // Convert payments
        if (transaction.getPayments() != null) {
            dto.setPayments(transaction.getPayments().stream()
                    .map(this::convertToPaymentDTO)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private PaymentDTO convertToPaymentDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentReference(payment.getPaymentReference());
        dto.setAmount(payment.getAmount());
        dto.setStatus(payment.getStatus().name());
        dto.setPaymentMethod(payment.getPaymentMethod().name());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}