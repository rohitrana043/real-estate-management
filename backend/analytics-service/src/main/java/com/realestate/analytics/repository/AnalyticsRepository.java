package com.realestate.analytics.repository;

import com.realestate.analytics.model.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;

public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByCity(String city);
    List<Analytics> findByPropertyType(String propertyType);

    @Query("SELECT a FROM Analytics a WHERE a.reportDate BETWEEN ?1 AND ?2")
    List<Analytics> findAnalyticsInDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT a FROM Analytics a WHERE a.city = ?1 AND a.propertyType = ?2 " +
            "ORDER BY a.reportDate DESC LIMIT 1")
    Optional<Analytics> findLatestByCityAndPropertyType(String city, String propertyType);

    @Query("SELECT a FROM Analytics a WHERE a.reportDate >= ?1 ORDER BY a.reportDate DESC")
    List<Analytics> findRecentAnalytics(LocalDateTime since);
}