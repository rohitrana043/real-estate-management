package com.realestate.analytics.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AnalyticsDTO {
    private Long id;
    private LocalDateTime reportDate;
    private Integer totalProperties;
    private Integer availableProperties;
    private Integer soldProperties;
    private BigDecimal totalRevenue;
    private BigDecimal averagePrice;
    private String city;
    private String propertyType;
}