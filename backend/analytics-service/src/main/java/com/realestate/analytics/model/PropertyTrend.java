package com.realestate.analytics.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "property_trends")
public class PropertyTrend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trend_date", nullable = false)
    private LocalDateTime trendDate;

    @Column(nullable = false)
    private String city;

    @Column(name = "property_type", nullable = false)
    private String propertyType;

    @Column(name = "average_price", nullable = false)
    private BigDecimal averagePrice;

    @Column(name = "price_change_percentage")
    private Double priceChangePercentage = 0.0; // Default value

    @Column(name = "demand_score")
    private Integer demandScore = 0; // Default value

    @PrePersist
    protected void onCreate() {
        if (trendDate == null) {
            trendDate = LocalDateTime.now();
        }
        if (priceChangePercentage == null) {
            priceChangePercentage = 0.0;
        }
        if (demandScore == null) {
            demandScore = 0;
        }
    }
}