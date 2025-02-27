package com.realestate.analytics.repository;

import com.realestate.analytics.model.PropertyTrend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyTrendRepository extends JpaRepository<PropertyTrend, Long> {

    List<PropertyTrend> findByCityOrderByTrendDateDesc(String city);

    List<PropertyTrend> findByPropertyTypeOrderByTrendDateDesc(String propertyType);

    List<PropertyTrend> findByCityAndPropertyTypeOrderByTrendDateDesc(String city, String propertyType);

    List<PropertyTrend> findAllByOrderByTrendDateDesc();
}