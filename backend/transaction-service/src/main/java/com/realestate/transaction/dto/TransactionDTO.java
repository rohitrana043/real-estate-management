package com.realestate.transaction.dto;

import com.realestate.transaction.model.TransactionStatus;
import com.realestate.transaction.model.TransactionType;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long id;
    private Long propertyId;
    private Long buyerId;
    private Long sellerId;
    private BigDecimal amount;
    private TransactionType type;
    private TransactionStatus status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
