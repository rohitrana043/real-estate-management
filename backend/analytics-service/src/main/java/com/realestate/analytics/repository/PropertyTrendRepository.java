package com.realestate.analytics.repository;

import com.realestate.analytics.model.PropertyTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface PropertyTrendRepository extends JpaRepository<PropertyTrend, Long> {
    List<PropertyTrend> findByCityOrderByTrendDateDesc(String city);
    List<PropertyTrend> findByPropertyTypeOrderByTrendDateDesc(String propertyType);

    @Query("SELECT pt FROM PropertyTrend pt WHERE pt.trendDate >= ?1")
    List<PropertyTrend> findRecentTrends(LocalDateTime since);

    @Query("SELECT pt FROM PropertyTrend pt WHERE pt.city = ?1 AND pt.propertyType = ?2 " +
            "ORDER BY pt.trendDate DESC LIMIT 1")
    PropertyTrend findLatestByCityAndPropertyType(String city, String propertyType);

    @Query("SELECT AVG(pt.demandScore) FROM PropertyTrend pt WHERE pt.city = ?1 " +
            "AND pt.trendDate >= ?2")
    Double getAverageDemandScore(String city, LocalDateTime since);
}