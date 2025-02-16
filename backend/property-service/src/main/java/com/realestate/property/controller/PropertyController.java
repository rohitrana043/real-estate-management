package com.realestate.property.controller;

import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.dto.PropertySearchCriteria;
import com.realestate.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
public class PropertyController {
    private final PropertyService propertyService;

    @Operation(summary = "Create a new property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody PropertyDTO propertyDTO) {
        log.debug("REST request to create Property : {}", propertyDTO);
        return ResponseEntity.ok(propertyService.createProperty(propertyDTO));
    }

    @Operation(summary = "Update an existing property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property updated successfully"),
            @ApiResponse(responseCode = "404", description = "Property not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyDTO propertyDTO) {
        log.debug("REST request to update Property : {}, {}", id, propertyDTO);
        return ResponseEntity.ok(propertyService.updateProperty(id, propertyDTO));
    }

    @Operation(summary = "Get a property by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the property"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getProperty(@PathVariable Long id) {
        log.debug("REST request to get Property : {}", id);
        return ResponseEntity.ok(propertyService.getProperty(id));
    }

    @Operation(summary = "Get all properties with pagination")
    @GetMapping("/")
    public ResponseEntity<Page<PropertyDTO>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
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

    @Operation(summary = "Delete a property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        log.debug("REST request to delete Property : {}", id);
        propertyService.deleteProperty(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Search properties with criteria")
    @GetMapping("/search")
    public ResponseEntity<Page<PropertyDTO>> searchProperties(
            @ModelAttribute PropertySearchCriteria criteria,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
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