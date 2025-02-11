package com.realestate.analytics.controller;

import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyTrendDTO;
import com.realestate.analytics.service.AnalyticsService;
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
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @PostMapping("/generate")
    public ResponseEntity<AnalyticsDTO> generateAnalytics(
            @RequestParam String city,
            @RequestParam String propertyType) {
        return ResponseEntity.ok(analyticsService.generateAnalytics(city, propertyType));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsByCity(@PathVariable String city) {
        return ResponseEntity.ok(analyticsService.getAnalyticsByCity(city));
    }

    @GetMapping("/property-type/{propertyType}")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsByPropertyType(@PathVariable String propertyType) {
        return ResponseEntity.ok(analyticsService.getAnalyticsByPropertyType(propertyType));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<AnalyticsDTO>> getAnalyticsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(analyticsService.getAnalyticsInDateRange(startDate, endDate));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<PropertyTrendDTO>> getPropertyTrends(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String propertyType) {
        return ResponseEntity.ok(analyticsService.getPropertyTrends(city, propertyType));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
}