package com.realestate.property.service;

import com.realestate.property.dto.PropertyDTO;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {
    PropertyDTO createProperty(PropertyDTO propertyDTO);
    PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO);
    PropertyDTO getProperty(Long id);
    List<PropertyDTO> getAllProperties();
    void deleteProperty(Long id);
    List<PropertyDTO> searchProperties(String status, String type, BigDecimal maxPrice);
}