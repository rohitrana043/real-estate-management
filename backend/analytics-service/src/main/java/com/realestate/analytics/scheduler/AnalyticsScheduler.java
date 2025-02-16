package com.realestate.analytics.scheduler;

import com.realestate.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnalyticsScheduler {

    private final AnalyticsService analyticsService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void generateDailyAnalytics() {
        log.info("Starting daily analytics generation");
        try {
            // Generate analytics for major cities
            generateAnalyticsForCity("New York");
            generateAnalyticsForCity("Los Angeles");
            generateAnalyticsForCity("Chicago");
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
            updateTrendsForType("Apartment");
            updateTrendsForType("House");
            updateTrendsForType("Condo");
            log.info("Completed hourly property trend update");
        } catch (Exception e) {
            log.error("Error updating property trends", e);
        }
    }

    private void generateAnalyticsForCity(String city) {
        analyticsService.generateAnalytics(city, "Apartment");
        analyticsService.generateAnalytics(city, "House");
        analyticsService.generateAnalytics(city, "Condo");
    }

    private void updateTrendsForType(String propertyType) {
        analyticsService.getPropertyTrends(null, propertyType);
    }
}