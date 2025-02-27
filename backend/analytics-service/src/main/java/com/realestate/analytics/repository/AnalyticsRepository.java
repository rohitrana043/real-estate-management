package com.realestate.analytics.repository;

import com.realestate.analytics.model.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {

    List<Analytics> findByCity(String city);

    List<Analytics> findByPropertyType(String propertyType);

    List<Analytics> findByCityAndPropertyType(String city, String propertyType);

    @Query("SELECT a FROM Analytics a WHERE a.reportDate BETWEEN :startDate AND :endDate ORDER BY a.reportDate DESC")
    List<Analytics> findAnalyticsInDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    List<Analytics> findAllByOrderByReportDateDesc();
}