package com.realestate.transaction.service;

import com.realestate.transaction.dto.TransactionDTO;
import com.realestate.transaction.model.TransactionStatus;
import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO);
    TransactionDTO getTransaction(Long id);
    List<TransactionDTO> getAllTransactions();
    List<TransactionDTO> getTransactionsByBuyer(Long buyerId);
    List<TransactionDTO> getTransactionsBySeller(Long sellerId);
    List<TransactionDTO> getTransactionsByProperty(Long propertyId);
    TransactionDTO updateTransactionStatus(Long id, TransactionStatus status);
}
