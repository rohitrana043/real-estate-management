package com.realestate.transaction.dto;

        import lombok.Data;
        import java.math.BigDecimal;
        import java.time.LocalDateTime;

@Data
public class RefundDTO {
    private String refundId;
    private String paymentReference;
    private BigDecimal amount;
    private String status;
    private LocalDateTime refundDate;
    private String reason;
}