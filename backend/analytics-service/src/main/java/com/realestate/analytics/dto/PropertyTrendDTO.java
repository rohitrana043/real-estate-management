package com.realestate.analytics.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PropertyTrendDTO {
    private Long id;
    private LocalDateTime trendDate;
    private String city;
    private String propertyType;
    private BigDecimal averagePrice;
    private Double priceChangePercentage;
    private Integer demandScore;
}