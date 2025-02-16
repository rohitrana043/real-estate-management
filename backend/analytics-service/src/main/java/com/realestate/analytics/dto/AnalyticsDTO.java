package com.realestate.analytics.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Schema(description = "Analytics Data Transfer Object")
public class AnalyticsDTO {
    @Schema(description = "Unique identifier of the analytics record")
    private Long id;

    @Schema(description = "Date and time when the report was generated", example = "2024-02-12T10:30:00")
    private LocalDateTime reportDate;

    @Schema(description = "Total number of properties in the dataset", example = "1500")
    private Integer totalProperties;

    @Schema(description = "Number of properties currently available", example = "750")
    private Integer availableProperties;

    @Schema(description = "Number of properties sold", example = "750")
    private Integer soldProperties;

    @Schema(description = "Total revenue from sold properties", example = "15000000.00")
    private BigDecimal totalRevenue;

    @Schema(description = "Average property price", example = "350000.00")
    private BigDecimal averagePrice;

    @Schema(description = "City name", example = "New York")
    private String city;

    @Schema(description = "Type of property", example = "Residential")
    private String propertyType;
}