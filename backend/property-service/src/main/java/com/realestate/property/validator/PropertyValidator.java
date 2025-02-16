package com.realestate.property.validator;

import com.realestate.property.dto.PropertyDTO;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.math.BigDecimal;

@Component
public class PropertyValidator implements Validator {

    private static final BigDecimal MIN_PRICE = new BigDecimal("1000");
    private static final BigDecimal MAX_PRICE = new BigDecimal("1000000000");
    private static final double MIN_AREA = 10.0;
    private static final double MAX_AREA = 1000000.0;

    @Override
    public boolean supports(Class<?> clazz) {
        return PropertyDTO.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        PropertyDTO property = (PropertyDTO) target;

        // Validate price range
        if (property.getPrice() != null) {
            if (property.getPrice().compareTo(MIN_PRICE) < 0) {
                errors.rejectValue("price", "price.too.low",
                        "Price must be at least " + MIN_PRICE);
            }
            if (property.getPrice().compareTo(MAX_PRICE) > 0) {
                errors.rejectValue("price", "price.too.high",
                        "Price must not exceed " + MAX_PRICE);
            }
        }

        // Validate area range
        if (property.getArea() != null) {
            if (property.getArea() < MIN_AREA) {
                errors.rejectValue("area", "area.too.small",
                        "Area must be at least " + MIN_AREA + " square meters");
            }
            if (property.getArea() > MAX_AREA) {
                errors.rejectValue("area", "area.too.large",
                        "Area must not exceed " + MAX_AREA + " square meters");
            }
        }

        // Validate bedrooms and bathrooms relationship
        if (property.getBedrooms() != null && property.getBathrooms() != null) {
            if (property.getBathrooms() > property.getBedrooms() + 2) {
                errors.rejectValue("bathrooms", "bathrooms.too.many",
                        "Number of bathrooms cannot exceed number of bedrooms by more than 2");
            }
        }
    }
}