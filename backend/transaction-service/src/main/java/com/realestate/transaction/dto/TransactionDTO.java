package com.realestate.transaction.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TransactionDTO {
    private Long id;
    private String transactionNumber;
    private Long propertyId;
    private Long buyerId;
    private Long sellerId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
    private List<PaymentDTO> payments;
    private List<DocumentDTO> documents;
}