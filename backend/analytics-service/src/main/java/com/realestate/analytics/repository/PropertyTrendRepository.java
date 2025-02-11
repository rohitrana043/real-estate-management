package com.realestate.analytics.repository;

import com.realestate.analytics.model.PropertyTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyTrendRepository extends JpaRepository<PropertyTrend, Long> {
    List<PropertyTrend> findByCityOrderByTrendDateDesc(String city);
    List<PropertyTrend> findByPropertyTypeOrderByTrendDateDesc(String propertyType);
}