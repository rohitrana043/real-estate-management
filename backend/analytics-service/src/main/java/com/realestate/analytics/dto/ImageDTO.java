package com.realestate.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
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