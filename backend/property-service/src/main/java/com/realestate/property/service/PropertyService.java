package com.realestate.property.service;

import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.dto.PropertySearchCriteria;
import com.realestate.property.exception.PropertyNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Validated
public interface PropertyService {
    /**
     * Creates a new property.
     *
     * @param propertyDTO the property information to create
     * @return the created property
     * @throws IllegalArgumentException if the property data is invalid
     */
    PropertyDTO createProperty(@NotNull @Valid PropertyDTO propertyDTO);

    /**
     * Updates an existing property.
     *
     * @param id the ID of the property to update
     * @param propertyDTO the updated property information
     * @return the updated property
     * @throws PropertyNotFoundException if the property is not found
     * @throws IllegalArgumentException if the property data is invalid
     */
    PropertyDTO updateProperty(@NotNull Long id, @NotNull @Valid PropertyDTO propertyDTO);

    /**
     * Retrieves a property by its ID.
     *
     * @param id the ID of the property to retrieve
     * @return the property
     * @throws PropertyNotFoundException if the property is not found
     */
    PropertyDTO getProperty(@NotNull Long id);

    /**
     * Get similar properties to the specified property
     *
     * @param id Property ID to find similar properties for
     * @param limit Maximum number of similar properties to return
     * @return List of similar property DTOs
     */
    List<PropertyDTO> getSimilarProperties(Long id, int limit);

    /**
     * Retrieves all properties with pagination.
     *
     * @param pageable pagination information
     * @return a page of properties
     */
    Page<PropertyDTO> getAllProperties(@NotNull Pageable pageable);

    /**
     * Deletes a property by its ID.
     *
     * @param id the ID of the property to delete
     * @throws PropertyNotFoundException if the property is not found
     */
    void deleteProperty(@NotNull Long id);

    /**
     * Searches for properties based on given criteria.
     *
     * @param criteria the search criteria
     * @param pageable pagination information
     * @return a page of properties matching the criteria
     * @throws IllegalArgumentException if the search criteria is invalid
     */
    Page<PropertyDTO> searchProperties(@NotNull PropertySearchCriteria criteria, @NotNull Pageable pageable);
}