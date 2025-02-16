// PropertyRepository.java
package com.realestate.property.repository;

import com.realestate.property.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findByStatus(String status);
    List<Property> findByTypeAndPriceLessThanEqual(String type, BigDecimal maxPrice);
    List<Property> findByCityAndState(String city, String state);
    List<Property> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Property> findByBedroomsGreaterThanEqual(Integer minBedrooms);
    List<Property> findByAreaGreaterThanEqual(Double minArea);
}