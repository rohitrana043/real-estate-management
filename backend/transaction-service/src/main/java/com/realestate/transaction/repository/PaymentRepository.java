package com.realestate.transaction.repository;

import com.realestate.transaction.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTransactionId(Long transactionId);
    Optional<Payment> findByPaymentReference(String paymentReference);
}