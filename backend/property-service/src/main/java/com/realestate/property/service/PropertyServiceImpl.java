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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {
    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;
    private final PropertyValidator propertyValidator;
    private final ApplicationEventPublisher eventPublisher;
    private final FavoritePropertyServiceImpl favoriteService;

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

        PropertyDTO dto = propertyMapper.toDTO(property);

        // Get the current authenticated user if available
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !"anonymousUser".equals(authentication.getPrincipal())) {
                String userEmail = authentication.getName();

                // Set favorite status
                dto.setFavorite(favoriteService.isFavorite(id, userEmail));
            }

            // Set favorite count regardless of authentication
            dto.setFavoriteCount(favoriteService.getFavoriteCount(id));
        } catch (Exception e) {
            log.warn("Error getting favorite info for property id: {}", id, e);
            // Don't fail the whole request if favorite info can't be retrieved
            dto.setFavorite(false);
            dto.setFavoriteCount(0);
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getAllProperties(Pageable pageable) {
        log.info("Fetching all properties with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        Page<Property> propertyPage = propertyRepository.findAll(pageable);

        // Convert to DTOs
        Page<PropertyDTO> dtoPage = propertyPage.map(propertyMapper::toDTO);

        // Enrich with favorite info if authenticated
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !"anonymousUser".equals(authentication.getPrincipal())) {
                String userEmail = authentication.getName();
                Set<Long> favoriteIds = favoriteService.getFavoritedPropertyIds(userEmail);

                // Update favorite status
                dtoPage.getContent().forEach(dto -> {
                    dto.setFavorite(favoriteIds.contains(dto.getId()));
                    dto.setFavoriteCount(favoriteService.getFavoriteCount(dto.getId()));
                });
            } else {
                // Just set favorite counts
                dtoPage.getContent().forEach(dto ->
                        dto.setFavoriteCount(favoriteService.getFavoriteCount(dto.getId())));
            }
        } catch (Exception e) {
            log.warn("Error getting favorite info for properties", e);
        }

        return dtoPage;
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
        Page<PropertyDTO> dtoPage = propertyRepository.findAll(spec, pageable)
                .map(propertyMapper::toDTO);

        // Enrich with favorite info if authenticated
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !"anonymousUser".equals(authentication.getPrincipal())) {
                String userEmail = authentication.getName();
                Set<Long> favoriteIds = favoriteService.getFavoritedPropertyIds(userEmail);

                // Update favorite status
                dtoPage.getContent().forEach(dto -> {
                    dto.setFavorite(favoriteIds.contains(dto.getId()));
                    dto.setFavoriteCount(favoriteService.getFavoriteCount(dto.getId()));
                });
            } else {
                // Just set favorite counts
                dtoPage.getContent().forEach(dto ->
                        dto.setFavoriteCount(favoriteService.getFavoriteCount(dto.getId())));
            }
        } catch (Exception e) {
            log.warn("Error getting favorite info for properties", e);
        }

        return dtoPage;
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

    @Override
    @Transactional(readOnly = true)
    public List<PropertyDTO> getSimilarProperties(Long id, int limit) {
        log.info("Finding similar properties for property with id: {}", id);

        // Get the source property
        Property sourceProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));

        // Build criteria for similar properties
        PropertySearchCriteria criteria = new PropertySearchCriteria();

        // Same property type
        criteria.setType(sourceProperty.getType());

        // Similar price range (±20%)
        BigDecimal priceMin = sourceProperty.getPrice().multiply(new BigDecimal("0.8"));
        BigDecimal priceMax = sourceProperty.getPrice().multiply(new BigDecimal("1.2"));
        criteria.setMinPrice(priceMin);
        criteria.setMaxPrice(priceMax);

        // Same location (city and state)
        criteria.setCity(sourceProperty.getCity());
        criteria.setState(sourceProperty.getState());

        // Similar bedrooms (±1)
        criteria.setMinBedrooms(Math.max(1, sourceProperty.getBedrooms() - 1));
        criteria.setMaxBedrooms(sourceProperty.getBedrooms() + 1);

        // Find similar properties
        Specification<Property> spec = PropertySpecifications.withCriteria(criteria);

        // Add a condition to exclude the source property
        Specification<Property> notSameProperty = (root, query, cb) ->
                cb.notEqual(root.get("id"), sourceProperty.getId());

        // Apply both specifications
        List<Property> similarProperties = propertyRepository.findAll(
                Specification.where(spec).and(notSameProperty),
                PageRequest.of(0, limit)
        ).getContent();

        // If we don't have enough results, try with more relaxed criteria
        if (similarProperties.size() < limit) {
            log.debug("Not enough similar properties found with strict criteria. Relaxing criteria...");

            // Reset criteria for a broader search
            criteria = new PropertySearchCriteria();

            // Only keep property type
            criteria.setType(sourceProperty.getType());

            // Wider price range (±30%)
            priceMin = sourceProperty.getPrice().multiply(new BigDecimal("0.7"));
            priceMax = sourceProperty.getPrice().multiply(new BigDecimal("1.3"));
            criteria.setMinPrice(priceMin);
            criteria.setMaxPrice(priceMax);

            // Same state only
            criteria.setState(sourceProperty.getState());

            // Apply relaxed criteria
            spec = PropertySpecifications.withCriteria(criteria);

            similarProperties = propertyRepository.findAll(
                    Specification.where(spec).and(notSameProperty),
                    PageRequest.of(0, limit)
            ).getContent();
        }

        // If we still don't have enough, do a final search with minimal criteria
        if (similarProperties.size() < limit) {
            log.debug("Still not enough similar properties. Using minimal criteria...");

            // Reset criteria for the broadest search
            criteria = new PropertySearchCriteria();

            // Only keep property type
            criteria.setType(sourceProperty.getType());

            // Apply minimal criteria
            spec = PropertySpecifications.withCriteria(criteria);

            similarProperties = propertyRepository.findAll(
                    Specification.where(spec).and(notSameProperty),
                    PageRequest.of(0, limit)
            ).getContent();
        }

        // Convert to DTOs and enrich with favorite info
        List<PropertyDTO> dtoList = similarProperties.stream()
                .map(propertyMapper::toDTO)
                .collect(Collectors.toList());

        // Enrich with favorite info if authenticated
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !"anonymousUser".equals(authentication.getPrincipal())) {
                String userEmail = authentication.getName();
                Set<Long> favoriteIds = favoriteService.getFavoritedPropertyIds(userEmail);

                // Update favorite status
                dtoList.forEach(dto -> {
                    dto.setFavorite(favoriteIds.contains(dto.getId()));
                    dto.setFavoriteCount(favoriteService.getFavoriteCount(dto.getId()));
                });
            } else {
                // Just set favorite counts
                dtoList.forEach(dto ->
                        dto.setFavoriteCount(favoriteService.getFavoriteCount(dto.getId())));
            }
        } catch (Exception e) {
            log.warn("Error getting favorite info for similar properties", e);
        }

        return dtoList;
    }
}