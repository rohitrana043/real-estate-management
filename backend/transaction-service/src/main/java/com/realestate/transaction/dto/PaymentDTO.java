package com.realestate.transaction.dto;

import com.realestate.transaction.model.PaymentMethod;
import com.realestate.transaction.model.PaymentStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentDTO {
    private Long id;
    private Long transactionId;
    private BigDecimal amount;
    private PaymentStatus status;
    private PaymentMethod method;
    private String paymentReference;
}
