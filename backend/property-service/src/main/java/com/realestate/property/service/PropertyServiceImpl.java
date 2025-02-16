package com.realestate.property.service;

import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.dto.PropertySearchCriteria;
import com.realestate.property.exception.PropertyNotFoundException;
import com.realestate.property.mapper.PropertyMapper;
import com.realestate.property.model.Property;
import com.realestate.property.repository.PropertyRepository;
import com.realestate.property.repository.PropertySpecifications;
import com.realestate.property.validator.PropertyValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final PropertyValidator propertyValidator;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    @CacheEvict(value = "properties", allEntries = true)
    public PropertyDTO createProperty(PropertyDTO propertyDTO) {
        log.info("Creating new property: {}", propertyDTO.getTitle());

        // Validate business rules
        Errors errors = new BeanPropertyBindingResult(propertyDTO, "propertyDTO");
        propertyValidator.validate(propertyDTO, errors);
        if (errors.hasErrors()) {
            throw new IllegalArgumentException(errors.getAllErrors().get(0).getDefaultMessage());
        }

        // Convert DTO to entity and save
        Property property = propertyMapper.toEntity(propertyDTO);
        Property savedProperty = propertyRepository.save(property);

        return propertyMapper.toDTO(savedProperty);
    }

    @Override
    @Transactional
    @CacheEvict(value = "properties", allEntries = true)
    public PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO) {
        log.info("Updating property with id: {}", id);

        // Validate business rules
        Errors errors = new BeanPropertyBindingResult(propertyDTO, "propertyDTO");
        propertyValidator.validate(propertyDTO, errors);
        if (errors.hasErrors()) {
            throw new IllegalArgumentException(errors.getAllErrors().get(0).getDefaultMessage());
        }

        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));

        // Store old values for comparison if needed
        String oldStatus = property.getStatus();

        // Update properties
        propertyMapper.updatePropertyFromDTO(propertyDTO, property);
        Property updatedProperty = propertyRepository.save(property);

        // Publish update event with specific details if needed
        String eventAction = "UPDATED";
        if (!oldStatus.equals(property.getStatus())) {
            eventAction = "STATUS_CHANGED_" + property.getStatus();
        }

        return propertyMapper.toDTO(updatedProperty);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "properties", key = "#id")
    public PropertyDTO getProperty(Long id) {
        log.info("Fetching property with id: {}", id);
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));
        return propertyMapper.toDTO(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getAllProperties(Pageable pageable) {
        log.info("Fetching all properties with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());
        return propertyRepository.findAll(pageable)
                .map(propertyMapper::toDTO);
    }

    @Override
    @Transactional
    @CacheEvict(value = "properties", key = "#id")
    public void deleteProperty(Long id) {
        log.info("Deleting property with id: {}", id);
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));

        // Delete the property
        propertyRepository.delete(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyDTO> searchProperties(PropertySearchCriteria criteria, Pageable pageable) {
        log.info("Searching properties with criteria: {}", criteria);

        // Validate search criteria
        validateSearchCriteria(criteria);

        Specification<Property> spec = PropertySpecifications.withCriteria(criteria);
        return propertyRepository.findAll(spec, pageable)
                .map(propertyMapper::toDTO);
    }

    private void validateSearchCriteria(PropertySearchCriteria criteria) {
        // Add validation logic for search criteria
        if (criteria.getMinPrice() != null && criteria.getMaxPrice() != null
                && criteria.getMinPrice().compareTo(criteria.getMaxPrice()) > 0) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
        }

        if (criteria.getMinArea() != null && criteria.getMaxArea() != null
                && criteria.getMinArea() > criteria.getMaxArea()) {
            throw new IllegalArgumentException("Minimum area cannot be greater than maximum area");
        }

        if (criteria.getMinBedrooms() != null && criteria.getMaxBedrooms() != null
                && criteria.getMinBedrooms() > criteria.getMaxBedrooms()) {
            throw new IllegalArgumentException("Minimum bedrooms cannot be greater than maximum bedrooms");
        }

        if (criteria.getMinBathrooms() != null && criteria.getMaxBathrooms() != null
                && criteria.getMinBathrooms() > criteria.getMaxBathrooms()) {
            throw new IllegalArgumentException("Minimum bathrooms cannot be greater than maximum bathrooms");
        }
    }
}