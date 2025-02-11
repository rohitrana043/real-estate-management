package com.realestate.transaction.service;

import com.realestate.transaction.dto.TransactionDTO;
import com.realestate.transaction.model.Transaction;
import com.realestate.transaction.model.TransactionStatus;
import com.realestate.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;

    @Override
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        BeanUtils.copyProperties(transactionDTO, transaction);
        transaction.setStatus(TransactionStatus.PENDING);
        Transaction savedTransaction = transactionRepository.save(transaction);
        TransactionDTO savedDTO = new TransactionDTO();
        BeanUtils.copyProperties(savedTransaction, savedDTO);
        return savedDTO;
    }

    @Override
    public TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        BeanUtils.copyProperties(transactionDTO, transaction, "id", "createdAt");
        Transaction updatedTransaction = transactionRepository.save(transaction);
        TransactionDTO updatedDTO = new TransactionDTO();
        BeanUtils.copyProperties(updatedTransaction, updatedDTO);
        return updatedDTO;
    }

    @Override
    public TransactionDTO getTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        TransactionDTO transactionDTO = new TransactionDTO();
        BeanUtils.copyProperties(transaction, transactionDTO);
        return transactionDTO;
    }

    @Override
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(transaction -> {
                    TransactionDTO dto = new TransactionDTO();
                    BeanUtils.copyProperties(transaction, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByBuyer(Long buyerId) {
        return transactionRepository.findByBuyerId(buyerId).stream()
                .map(transaction -> {
                    TransactionDTO dto = new TransactionDTO();
                    BeanUtils.copyProperties(transaction, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsBySeller(Long sellerId) {
        return transactionRepository.findBySellerId(sellerId).stream()
                .map(transaction -> {
                    TransactionDTO dto = new TransactionDTO();
                    BeanUtils.copyProperties(transaction, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByProperty(Long propertyId) {
        return transactionRepository.findByPropertyId(propertyId).stream()
                .map(transaction -> {
                    TransactionDTO dto = new TransactionDTO();
                    BeanUtils.copyProperties(transaction, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDTO updateTransactionStatus(Long id, TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setStatus(status);
        Transaction updatedTransaction = transactionRepository.save(transaction);
        TransactionDTO updatedDTO = new TransactionDTO();
        BeanUtils.copyProperties(updatedTransaction, updatedDTO);
        return updatedDTO;
    }
}
