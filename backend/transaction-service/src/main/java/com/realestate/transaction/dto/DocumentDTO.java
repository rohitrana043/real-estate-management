// DocumentDTO.java
package com.realestate.transaction.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DocumentDTO {
    private Long id;
    private Long transactionId;
    private String documentName;
    private String documentType;
    private String documentUrl;
    private String status;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}