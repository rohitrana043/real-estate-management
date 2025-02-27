package com.realestate.analytics.scheduler;

import com.realestate.analytics.client.PropertiesServiceClient;
import com.realestate.analytics.dto.PropertyDTO;
import com.realestate.analytics.dto.PropertySearchResponse;
import com.realestate.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsScheduler {

    private final AnalyticsService analyticsService;
    private final PropertiesServiceClient propertiesClient;

    // Property types to analyze (can be adjusted based on your actual property types)
    private final List<String> PROPERTY_TYPES = Arrays.asList("HOUSE", "APARTMENT", "COMMERCIAL", "CONDO");

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void generateDailyAnalytics() {
        log.info("Starting daily analytics generation");
        try {
            // Get distinct cities from properties service
            Set<String> cities = getAvailableCities();
            log.info("Found {} cities for analytics: {}", cities.size(), cities);

            if (cities.isEmpty()) {
                log.warn("No cities found in properties data. Skipping analytics generation.");
                return;
            }

            // Generate analytics for each city and property type
            for (String city : cities) {
                for (String propertyType : PROPERTY_TYPES) {
                    log.info("Generating analytics for city: {} and property type: {}", city, propertyType);
                    analyticsService.generateAnalytics(city, propertyType);
                }
            }
            log.info("Completed daily analytics generation");
        } catch (Exception e) {
            log.error("Error generating daily analytics", e);
        }
    }

    // Run every hour
    @Scheduled(fixedRate = 3600000)
    public void updatePropertyTrends() {
        log.info("Starting hourly property trend update");
        try {
            // Get distinct cities from properties service
            Set<String> cities = getAvailableCities();

            if (cities.isEmpty()) {
                log.warn("No cities found in properties data. Skipping trend updates.");
                return;
            }

            // Update trends for each city/property type combination
            for (String city : cities) {
                for (String propertyType : PROPERTY_TYPES) {
                    log.info("Updating trends for city: {} and property type: {}", city, propertyType);
                    analyticsService.getPropertyTrends(city, propertyType);
                }
            }
            log.info("Completed hourly property trend update");
        } catch (Exception e) {
            log.error("Error updating property trends", e);
        }
    }

    /**
     * Fetches all available cities from the properties service
     */
    private Set<String> getAvailableCities() {
        try {
            Set<String> cities = new HashSet<>();

            // Fetch properties (with a large page size to get all/most properties)
            PropertySearchResponse response = propertiesClient.getAllProperties(0, 1000);

            if (response != null && response.getContent() != null) {
                // Extract unique city names
                cities = response.getContent().stream()
                        .map(PropertyDTO::getCity)
                        .filter(city -> city != null && !city.isEmpty())
                        .collect(Collectors.toSet());
            }

            return cities;
        } catch (Exception e) {
            log.error("Error fetching cities from properties service", e);
            return new HashSet<>();
        }
    }

    /**
     * Fetches all available property types from the properties service
     */
    private Set<String> getAvailablePropertyTypes() {
        try {
            Set<String> types = new HashSet<>();

            // Fetch properties
            PropertySearchResponse response = propertiesClient.getAllProperties(0, 1000);

            if (response != null && response.getContent() != null) {
                // Extract unique property types
                types = response.getContent().stream()
                        .map(PropertyDTO::getType)
                        .filter(type -> type != null && !type.isEmpty())
                        .collect(Collectors.toSet());
            }

            return types;
        } catch (Exception e) {
            log.error("Error fetching property types from properties service", e);
            return new HashSet<>();
        }
    }
}