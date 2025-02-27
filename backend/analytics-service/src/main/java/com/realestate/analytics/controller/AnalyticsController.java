package com.realestate.analytics.controller;

import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyTrendDTO;
import com.realestate.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Analytics", description = "Real Estate Analytics API - generates analytics based on property data from the Properties Service")
@SecurityRequirement(name = "bearer-key")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @Operation(
            summary = "Generate analytics",
            description = "Generates analytics data for a specific city and property type using real-time property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Analytics generated successfully",
                    content = @Content(schema = @Schema(implementation = AnalyticsDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input parameters"),
            @ApiResponse(responseCode = "404", description = "No properties found for specified criteria"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/generate")
    public ResponseEntity<AnalyticsDTO> generateAnalytics(
            @Parameter(description = "City name (must match property data)", required = true)
            @RequestParam String city,
            @Parameter(description = "Type of property (e.g., HOUSE, APARTMENT, COMMERCIAL)", required = true)
            @RequestParam String propertyType) {
        log.info("Received request to generate analytics for city: {} and property type: {}", city, propertyType);
        return ResponseEntity.ok(analyticsService.generateAnalytics(city, propertyType));
    }

    @Operation(
            summary = "Get analytics by city",
            description = "Retrieves all analytics data for a specific city from property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved city analytics",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AnalyticsDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "City not found in property data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/city/{city}")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsByCity(
            @Parameter(description = "City name (must match property data)", required = true)
            @PathVariable String city) {
        log.info("Received request to get analytics for city: {}", city);
        return ResponseEntity.ok(analyticsService.getAnalyticsByCity(city));
    }

    @Operation(
            summary = "Get analytics by property type",
            description = "Retrieves all analytics data for a specific property type from property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved property type analytics",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AnalyticsDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Property type not found in property data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/property-type/{propertyType}")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsByPropertyType(
            @Parameter(description = "Property type (e.g., HOUSE, APARTMENT, COMMERCIAL)", required = true)
            @PathVariable String propertyType) {
        log.info("Received request to get analytics for property type: {}", propertyType);
        return ResponseEntity.ok(analyticsService.getAnalyticsByPropertyType(propertyType));
    }

    @Operation(
            summary = "Get analytics by date range",
            description = "Retrieves all analytics data within a specific date range"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved date range analytics",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AnalyticsDTO.class)))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid date range"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/date-range")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsInDateRange(
            @Parameter(description = "Start date (ISO format)", required = true, example = "2025-02-01T00:00:00")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)", required = true, example = "2025-02-24T23:59:59")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("Received request to get analytics between {} and {}", startDate, endDate);
        return ResponseEntity.ok(analyticsService.getAnalyticsInDateRange(startDate, endDate));
    }

    @Operation(
            summary = "Get property trends",
            description = "Retrieves property trends filtered by city and/or property type based on property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved property trends",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = PropertyTrendDTO.class)))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/trends")
    public ResponseEntity<List<PropertyTrendDTO>> getPropertyTrends(
            @Parameter(description = "City name (optional, must match property data)")
            @RequestParam(required = false) String city,
            @Parameter(description = "Property type (optional, e.g., HOUSE, APARTMENT, COMMERCIAL)")
            @RequestParam(required = false) String propertyType) {
        log.info("Received request to get property trends. City: {}, Property Type: {}",
                city != null ? city : "All", propertyType != null ? propertyType : "All");
        return ResponseEntity.ok(analyticsService.getPropertyTrends(city, propertyType));
    }

    @Operation(
            summary = "Get dashboard statistics",
            description = "Retrieves comprehensive dashboard statistics from real property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved dashboard statistics",
                    content = @Content(schema = @Schema(implementation = Object.class, description = "Dashboard statistics object with various property metrics"))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        log.info("Received request to get dashboard statistics");
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @Operation(
            summary = "Get available cities",
            description = "Retrieves list of all cities present in property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved available cities",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = String.class)))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAvailableCities() {
        log.info("Received request to get available cities");
        // We'll implement this method in the service
        return ResponseEntity.ok(analyticsService.getAvailableCities());
    }

    @Operation(
            summary = "Get available property types",
            description = "Retrieves list of all property types present in property data"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved available property types",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = String.class)))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/property-types")
    public ResponseEntity<List<String>> getAvailablePropertyTypes() {
        log.info("Received request to get available property types");
        // We'll implement this method in the service
        return ResponseEntity.ok(analyticsService.getAvailablePropertyTypes());
    }
}