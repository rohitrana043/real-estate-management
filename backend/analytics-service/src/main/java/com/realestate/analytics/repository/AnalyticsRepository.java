package com.realestate.analytics.repository;

import com.realestate.analytics.model.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.time.LocalDateTime;

public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByCity(String city);
    List<Analytics> findByPropertyType(String propertyType);

    @Query("SELECT a FROM Analytics a WHERE a.reportDate BETWEEN ?1 AND ?2")
    List<Analytics> findAnalyticsInDateRange(LocalDateTime startDate, LocalDateTime endDate);
}