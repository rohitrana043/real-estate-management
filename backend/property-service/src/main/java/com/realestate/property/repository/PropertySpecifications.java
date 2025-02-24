package com.realestate.property.repository;

import com.realestate.property.dto.PropertySearchCriteria;
import com.realestate.property.model.Property;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Expression;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertySpecifications {

    public static Specification<Property> withCriteria(PropertySearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status filter
            if (criteria.getStatus() != null && !criteria.getStatus().isEmpty()) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            // Type filter
            if (criteria.getType() != null && !criteria.getType().isEmpty()) {
                predicates.add(cb.equal(root.get("type"), criteria.getType()));
            }

            // Price range filter
            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.<BigDecimal>get("price"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.<BigDecimal>get("price"), criteria.getMaxPrice()));
            }

            // Bedrooms filter
            if (criteria.getMinBedrooms() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), criteria.getMinBedrooms()));
            }
            if (criteria.getMaxBedrooms() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bedrooms"), criteria.getMaxBedrooms()));
            }

            // Bathrooms filter
            if (criteria.getMinBathrooms() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bathrooms"), criteria.getMinBathrooms()));
            }
            if (criteria.getMaxBathrooms() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("bathrooms"), criteria.getMaxBathrooms()));
            }

            // Area range filter
            if (criteria.getMinArea() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("area"), criteria.getMinArea()));
            }
            if (criteria.getMaxArea() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("area"), criteria.getMaxArea()));
            }

            // Location filters
            if (criteria.getCity() != null && !criteria.getCity().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("city")),
                        "%" + criteria.getCity().toLowerCase() + "%"));
            }

            if (criteria.getState() != null && !criteria.getState().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("state")),
                        "%" + criteria.getState().toLowerCase() + "%"));
            }

            if (criteria.getZipCode() != null && !criteria.getZipCode().isEmpty()) {
                predicates.add(cb.equal(root.get("zipCode"), criteria.getZipCode()));
            }

            // Enhanced keyword search for title, description, and location fields
            if (criteria.getKeyword() != null && !criteria.getKeyword().isEmpty()) {
                String keyword = "%" + criteria.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), keyword),
                        cb.like(cb.lower(root.get("description")), keyword),
                        cb.like(cb.lower(root.get("city")), keyword),
                        cb.like(cb.lower(root.get("state")), keyword),
                        cb.like(cb.lower(root.get("zipCode")), keyword)
                ));
            }

            // Date range filters
            if (criteria.getCreatedAfter() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), criteria.getCreatedAfter()));
            }
            if (criteria.getCreatedBefore() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), criteria.getCreatedBefore()));
            }

            // Price per square foot range
            if (criteria.getMaxPricePerSqFt() != null || criteria.getMinPricePerSqFt() != null) {
                Expression<Double> area = root.get("area");
                Expression<BigDecimal> price = root.get("price");
                Expression<BigDecimal> pricePerSqFt = cb.toBigDecimal(
                        cb.quot(
                                cb.toDouble(price),
                                area
                        )
                );

                if (criteria.getMinPricePerSqFt() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(pricePerSqFt, criteria.getMinPricePerSqFt()));
                }
                if (criteria.getMaxPricePerSqFt() != null) {
                    predicates.add(cb.lessThanOrEqualTo(pricePerSqFt, criteria.getMaxPricePerSqFt()));
                }
            }

            // Return the combined predicates
            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
