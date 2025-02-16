package com.realestate.transaction.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private String paymentReference;
    private BigDecimal amount;
    private String status;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String clientSecret;  // Added for Stripe integration
    private String stripePaymentIntentId;  // Added for Stripe integration
}