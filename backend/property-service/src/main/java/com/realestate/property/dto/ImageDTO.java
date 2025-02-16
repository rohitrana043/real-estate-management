package com.realestate.property.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ImageDTO {
    private Long id;
    private String name;
    private String type;
    private String url;
    private Long propertyId;
    private Boolean isMain;
    private Integer displayOrder;
    private Long fileSize;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}