package com.realestate.transaction.repository;

import com.realestate.transaction.model.Transaction;
import com.realestate.transaction.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyerId(Long buyerId);
    List<Transaction> findBySellerId(Long sellerId);
    List<Transaction> findByPropertyId(Long propertyId);
    List<Transaction> findByStatus(TransactionStatus status);
}
