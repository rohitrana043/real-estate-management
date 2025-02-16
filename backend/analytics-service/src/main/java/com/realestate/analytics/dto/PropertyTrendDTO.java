package com.realestate.analytics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Schema(description = "Property Trend Data Transfer Object")
public class PropertyTrendDTO {
    @Schema(description = "Unique identifier of the property trend")
    private Long id;

    @Schema(description = "Date and time when the trend was recorded", example = "2024-02-12T10:30:00")
    private LocalDateTime trendDate;

    @Schema(description = "City name", example = "New York")
    private String city;

    @Schema(description = "Type of property", example = "Residential")
    private String propertyType;

    @Schema(description = "Average property price for the trend period", example = "350000.00")
    private BigDecimal averagePrice;

    @Schema(description = "Percentage change in price compared to previous period", example = "5.5")
    private Double priceChangePercentage;

    @Schema(description = "Demand score (0-100) indicating market interest", example = "85")
    private Integer demandScore;
}