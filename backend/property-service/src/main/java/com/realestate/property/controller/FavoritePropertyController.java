package com.realestate.property.controller;

import com.realestate.property.dto.FavoritePropertyDTO;
import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.service.FavoritePropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/properties/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorite Properties", description = "APIs for managing favorite properties")
@SecurityRequirement(name = "bearer-jwt")
public class FavoritePropertyController {

    private final FavoritePropertyService favoriteService;

    /**
     * Helper method to get current user's email from JWT
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @Operation(
            summary = "Add property to favorites",
            description = "Adds a property to the current user's favorites"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Property added to favorites",
                    content = @Content(schema = @Schema(implementation = FavoritePropertyDTO.Simple.class))),
            @ApiResponse(responseCode = "404", description = "Property not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping("/{propertyId}")
    public ResponseEntity<FavoritePropertyDTO.Simple> addToFavorites(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId) {

        String userEmail = getCurrentUserEmail();
        log.info("REST request to add property id: {} to favorites for user: {}", propertyId, userEmail);

        FavoritePropertyDTO.Simple result = favoriteService.addToFavorites(propertyId, userEmail);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Remove property from favorites",
            description = "Removes a property from the current user's favorites"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Property removed from favorites"),
            @ApiResponse(responseCode = "404", description = "Property not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @DeleteMapping("/{propertyId}")
    public ResponseEntity<Void> removeFromFavorites(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId) {

        String userEmail = getCurrentUserEmail();
        log.info("REST request to remove property id: {} from favorites for user: {}", propertyId, userEmail);

        favoriteService.removeFromFavorites(propertyId, userEmail);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Get favorite properties",
            description = "Retrieves all properties favorited by the current user with pagination"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favorite properties retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping({"", "/"})
    public ResponseEntity<Page<PropertyDTO>> getFavoriteProperties(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort property and direction (e.g., 'createdAt,desc')")
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String userEmail = getCurrentUserEmail();
        log.info("REST request to get favorite properties for user: {}", userEmail);

        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 ?
                ("desc".equalsIgnoreCase(sortParams[1]) ? Sort.Direction.DESC : Sort.Direction.ASC) :
                Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
        return ResponseEntity.ok(favoriteService.getFavoriteProperties(userEmail, pageable));
    }

    @Operation(
            summary = "Check if property is favorited",
            description = "Checks if a property is in the current user's favorites"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/{propertyId}/status")
    public ResponseEntity<Map<String, Boolean>> checkFavoriteStatus(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId) {

        String userEmail = getCurrentUserEmail();
        log.info("REST request to check favorite status for property id: {} for user: {}", propertyId, userEmail);

        boolean isFavorite = favoriteService.isFavorite(propertyId, userEmail);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @Operation(
            summary = "Get favorite property IDs",
            description = "Retrieves all property IDs favorited by the current user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Favorite property IDs retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/ids")
    public ResponseEntity<Set<Long>> getFavoritePropertyIds() {
        String userEmail = getCurrentUserEmail();
        log.info("REST request to get favorite property IDs for user: {}", userEmail);

        return ResponseEntity.ok(favoriteService.getFavoritedPropertyIds(userEmail));
    }

    @Operation(
            summary = "Get total favorites count",
            description = "Gets the total number of properties favorited by the current user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalFavorites() {
        String userEmail = getCurrentUserEmail();
        log.info("REST request to get total favorites count for user: {}", userEmail);

        long count = favoriteService.getTotalFavorites(userEmail);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @Operation(
            summary = "Get property favorite count",
            description = "Gets the number of users who favorited a specific property"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @GetMapping("/{propertyId}/count")
    public ResponseEntity<Map<String, Long>> getPropertyFavoriteCount(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId) {

        log.info("REST request to get favorite count for property id: {}", propertyId);

        long count = favoriteService.getFavoriteCount(propertyId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}