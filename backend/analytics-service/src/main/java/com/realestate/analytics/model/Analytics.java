package com.realestate.analytics.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "analytics")
public class Analytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_date")
    private LocalDateTime reportDate;

    @Column(name = "total_properties")
    private Integer totalProperties;

    @Column(name = "available_properties")
    private Integer availableProperties;

    @Column(name = "sold_properties")
    private Integer soldProperties;

    @Column(name = "total_revenue")
    private BigDecimal totalRevenue;

    @Column(name = "average_price")
    private BigDecimal averagePrice;

    @Column(name = "city")
    private String city;

    @Column(name = "property_type")
    private String propertyType;

    @PrePersist
    protected void onCreate() {
        reportDate = LocalDateTime.now();
    }
}