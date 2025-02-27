package com.realestate.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertySearchCriteria {
    private String status;
    private String type;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer minBedrooms;
    private Integer maxBedrooms;
    private Integer minBathrooms;
    private Integer maxBathrooms;
    private Double minArea;
    private Double maxArea;
    private String city;
    private String state;
    private String zipCode;
    private String keyword;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private BigDecimal minPricePerSqFt;
    private BigDecimal maxPricePerSqFt;
}