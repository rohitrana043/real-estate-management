package com.realestate.analytics.controller;

import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyTrendDTO;
import com.realestate.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Real Estate Analytics API")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @Operation(
            summary = "Generate analytics",
            description = "Generates analytics data for a specific city and property type"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Analytics generated successfully",
                    content = @Content(schema = @Schema(implementation = AnalyticsDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/generate")
    public ResponseEntity<AnalyticsDTO> generateAnalytics(
            @Parameter(description = "City name", required = true)
            @RequestParam String city,
            @Parameter(description = "Type of property", required = true)
            @RequestParam String propertyType) {
        return ResponseEntity.ok(analyticsService.generateAnalytics(city, propertyType));
    }

    @Operation(
            summary = "Get analytics by city",
            description = "Retrieves all analytics data for a specific city"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved city analytics",
                    content = @Content(schema = @Schema(implementation = AnalyticsDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "City not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/city/{city}")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsByCity(
            @Parameter(description = "City name", required = true)
            @PathVariable String city) {
        return ResponseEntity.ok(analyticsService.getAnalyticsByCity(city));
    }

    @Operation(
            summary = "Get analytics by property type",
            description = "Retrieves all analytics data for a specific property type"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved property type analytics",
                    content = @Content(schema = @Schema(implementation = AnalyticsDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Property type not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/property-type/{propertyType}")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsByPropertyType(
            @Parameter(description = "Property type", required = true)
            @PathVariable String propertyType) {
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
                    content = @Content(schema = @Schema(implementation = AnalyticsDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid date range"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/date-range")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsInDateRange(
            @Parameter(description = "Start date (ISO format)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date (ISO format)", required = true)
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getAnalyticsInDateRange(startDate, endDate));
    }

    @Operation(
            summary = "Get property trends",
            description = "Retrieves property trends filtered by city and/or property type"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved property trends",
                    content = @Content(schema = @Schema(implementation = PropertyTrendDTO.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/trends")
    public ResponseEntity<List<PropertyTrendDTO>> getPropertyTrends(
            @Parameter(description = "City name (optional)")
            @RequestParam(required = false) String city,
            @Parameter(description = "Property type (optional)")
            @RequestParam(required = false) String propertyType) {
        return ResponseEntity.ok(analyticsService.getPropertyTrends(city, propertyType));
    }

    @Operation(
            summary = "Get dashboard statistics",
            description = "Retrieves comprehensive dashboard statistics"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved dashboard statistics",
                    content = @Content(schema = @Schema(implementation = Map.class))
            ),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
}