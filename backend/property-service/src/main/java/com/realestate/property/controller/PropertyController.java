package com.realestate.property.controller;

import com.realestate.property.config.PropertyApiResponses.StandardResponses;
import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.dto.PropertySearchCriteria;
import com.realestate.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Tag(name = "Property", description = "Property management APIs")
@Tag(name = "Property", description = "Property management APIs")
@SecurityRequirement(name = "bearer-jwt")
public class PropertyController {
    private final PropertyService propertyService;

    @Operation(
            summary = "Create a new property",
            description = "Creates a new property with the provided details"
    )
    @StandardResponses
    @PostMapping({"", "/"})
    public ResponseEntity<PropertyDTO> createProperty(
            @Parameter(description = "Property details", required = true)
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                                                                  required = true,
                                                                  content = @Content(schema = @Schema(implementation = PropertyDTO.class))
                                                          )
            @Valid @RequestBody PropertyDTO propertyDTO) {
        log.debug("REST request to create Property : {}", propertyDTO);
        return ResponseEntity.ok(propertyService.createProperty(propertyDTO));
    }

    @Operation(
            summary = "Update an existing property",
            description = "Updates the property with the specified ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property updated successfully"),
            @ApiResponse(responseCode = "404", description = "Property not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated property details", required = true)
            @Valid @RequestBody PropertyDTO propertyDTO) {
        log.debug("REST request to update Property : {}, {}", id, propertyDTO);
        return ResponseEntity.ok(propertyService.updateProperty(id, propertyDTO));
    }

    @Operation(
            summary = "Get a property by ID",
            description = "Retrieves the details of a specific property"
    )
    @StandardResponses
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getProperty(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long id) {
        log.debug("REST request to get Property : {}", id);
        return ResponseEntity.ok(propertyService.getProperty(id));
    }

    @Operation(
            summary = "Get all properties with pagination",
            description = "Retrieves a paginated list of properties with sorting options"
    )
    @StandardResponses
    @GetMapping({"", "/"})
    public ResponseEntity<Page<PropertyDTO>> getAllProperties(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.")
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        log.debug("REST request to get all Properties");
        List<Sort.Order> orders = new ArrayList<>();

        if (sort[0].contains(",")) {
            for (String sortOrder : sort) {
                String[] _sort = sortOrder.split(",");
                orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
            }
        } else {
            orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(orders));

        return ResponseEntity.ok(propertyService.getAllProperties(pageable));
    }

    @Operation(
            summary = "Delete a property",
            description = "Deletes the property with the specified ID"
    )
    @StandardResponses
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long id) {
        log.debug("REST request to delete Property : {}", id);
        propertyService.deleteProperty(id);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Get similar properties",
            description = "Retrieves properties similar to the specified property based on type, price range, and location"
    )
    @StandardResponses
    @GetMapping("/{id}/similar")
    public ResponseEntity<List<PropertyDTO>> getSimilarProperties(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long id,
            @Parameter(description = "Maximum number of similar properties to return")
            @RequestParam(defaultValue = "3") int limit) {
        log.debug("REST request to get similar properties for Property : {}", id);
        return ResponseEntity.ok(propertyService.getSimilarProperties(id, limit));
    }

    @Operation(
            summary = "Search properties with criteria",
            description = "Searches for properties based on various criteria with pagination and sorting options"
    )
    @StandardResponses
    @GetMapping("/search")
    public ResponseEntity<Page<PropertyDTO>> searchProperties(
            @Parameter(description = "Search criteria")
            @ModelAttribute PropertySearchCriteria criteria,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.")
            @RequestParam(defaultValue = "id,desc") String[] sort) {

        log.debug("REST request to search Properties with criteria: {}", criteria);
        List<Sort.Order> orders = new ArrayList<>();

        if (sort[0].contains(",")) {
            for (String sortOrder : sort) {
                String[] _sort = sortOrder.split(",");
                orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
            }
        } else {
            orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(orders));

        return ResponseEntity.ok(propertyService.searchProperties(criteria, pageable));
    }

    private Sort.Direction getSortDirection(String direction) {
        return direction.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    }
}