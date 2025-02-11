package com.realestate.property.service;

import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.model.Property;
import com.realestate.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
    private final PropertyRepository propertyRepository;

    @Override
    public PropertyDTO createProperty(PropertyDTO propertyDTO) {
        Property property = new Property();
        BeanUtils.copyProperties(propertyDTO, property);
        Property savedProperty = propertyRepository.save(property);
        PropertyDTO savedDTO = new PropertyDTO();
        BeanUtils.copyProperties(savedProperty, savedDTO);
        return savedDTO;
    }

    @Override
    public PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        BeanUtils.copyProperties(propertyDTO, property, "id");
        Property updatedProperty = propertyRepository.save(property);
        PropertyDTO updatedDTO = new PropertyDTO();
        BeanUtils.copyProperties(updatedProperty, updatedDTO);
        return updatedDTO;
    }

    @Override
    public PropertyDTO getProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        PropertyDTO propertyDTO = new PropertyDTO();
        BeanUtils.copyProperties(property, propertyDTO);
        return propertyDTO;
    }

    @Override
    public List<PropertyDTO> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(property -> {
                    PropertyDTO dto = new PropertyDTO();
                    BeanUtils.copyProperties(property, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    @Override
    public List<PropertyDTO> searchProperties(String status, String type, BigDecimal maxPrice) {
        List<Property> properties;
        if (type != null && maxPrice != null) {
            properties = propertyRepository.findByTypeAndPriceLessThanEqual(type, maxPrice);
        } else if (status != null) {
            properties = propertyRepository.findByStatus(status);
        } else {
            properties = propertyRepository.findAll();
        }

        return properties.stream()
                .map(property -> {
                    PropertyDTO dto = new PropertyDTO();
                    BeanUtils.copyProperties(property, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }
}