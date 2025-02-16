package com.realestate.transaction.repository;

import com.realestate.transaction.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyerId(Long buyerId);
    List<Transaction> findBySellerId(Long sellerId);
    List<Transaction> findByPropertyId(Long propertyId);
    Optional<Transaction> findByTransactionNumber(String transactionNumber);
}