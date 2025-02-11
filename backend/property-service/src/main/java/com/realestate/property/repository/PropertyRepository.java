package com.realestate.property.repository;

import com.realestate.property.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByStatus(String status);
    List<Property> findByTypeAndPriceLessThanEqual(String type, BigDecimal maxPrice);
    List<Property> findByCityAndState(String city, String state);
}