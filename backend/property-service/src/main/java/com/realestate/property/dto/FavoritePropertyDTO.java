package com.realestate.property.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePropertyDTO {
    private Long id;
    private PropertyDTO property;
    private String userEmail;
    private LocalDateTime createdAt;

    // Simple version without full property details
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Simple {
        private Long id;
        private Long propertyId;
        private String userEmail;
        private LocalDateTime createdAt;
    }
}