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

    @Column(name = "trend_date")
    private LocalDateTime trendDate;

    private String city;

    @Column(name = "property_type")
    private String propertyType;

    @Column(name = "average_price")
    private BigDecimal averagePrice;

    @Column(name = "price_change_percentage")
    private Double priceChangePercentage;

    @Column(name = "demand_score")
    private Integer demandScore;
}