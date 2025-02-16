package com.realestate.transaction.service;

import com.realestate.transaction.dto.TransactionDTO;

import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    TransactionDTO getTransaction(Long id);
    List<TransactionDTO> getTransactionsByBuyer(Long buyerId);
    List<TransactionDTO> getTransactionsBySeller(Long sellerId);
    TransactionDTO updateTransactionStatus(Long id, String status);
    void deleteTransaction(Long id);
}