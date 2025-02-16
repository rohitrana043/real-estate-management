package com.realestate.analytics.config;

import com.realestate.analytics.model.Analytics;
import com.realestate.analytics.model.PropertyTrend;
import com.realestate.analytics.repository.AnalyticsRepository;
import com.realestate.analytics.repository.PropertyTrendRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class TestDataLoader implements CommandLineRunner {

    private final AnalyticsRepository analyticsRepository;
    private final PropertyTrendRepository propertyTrendRepository;

    @Override
    public void run(String... args) {
        // Create test data only if the repositories are empty
        if (analyticsRepository.count() == 0) {
            loadAnalyticsData();
        }
        if (propertyTrendRepository.count() == 0) {
            loadPropertyTrendData();
        }
    }

    private void loadAnalyticsData() {
        // Sample data for New York
        Analytics nyApartment = new Analytics();
        nyApartment.setCity("New York");
        nyApartment.setPropertyType("Apartment");
        nyApartment.setTotalProperties(100);
        nyApartment.setAvailableProperties(30);
        nyApartment.setSoldProperties(70);
        nyApartment.setTotalRevenue(BigDecimal.valueOf(35000000));
        nyApartment.setAveragePrice(BigDecimal.valueOf(500000));
        nyApartment.setReportDate(LocalDateTime.now().minusDays(7));

        // Sample data for Los Angeles
        Analytics laHouse = new Analytics();
        laHouse.setCity("Los Angeles");
        laHouse.setPropertyType("House");
        laHouse.setTotalProperties(80);
        laHouse.setAvailableProperties(20);
        laHouse.setSoldProperties(60);
        laHouse.setTotalRevenue(BigDecimal.valueOf(48000000));
        laHouse.setAveragePrice(BigDecimal.valueOf(800000));
        laHouse.setReportDate(LocalDateTime.now().minusDays(7));

        // Sample data for Chicago
        Analytics chicagoCondo = new Analytics();
        chicagoCondo.setCity("Chicago");
        chicagoCondo.setPropertyType("Condo");
        chicagoCondo.setTotalProperties(120);
        chicagoCondo.setAvailableProperties(40);
        chicagoCondo.setSoldProperties(80);
        chicagoCondo.setTotalRevenue(BigDecimal.valueOf(24000000));
        chicagoCondo.setAveragePrice(BigDecimal.valueOf(300000));
        chicagoCondo.setReportDate(LocalDateTime.now().minusDays(7));

        analyticsRepository.saveAll(Arrays.asList(nyApartment, laHouse, chicagoCondo));
    }

    private void loadPropertyTrendData() {
        // New York trends
        PropertyTrend nyTrend = new PropertyTrend();
        nyTrend.setCity("New York");
        nyTrend.setPropertyType("Apartment");
        nyTrend.setTrendDate(LocalDateTime.now().minusDays(7));
        nyTrend.setAveragePrice(BigDecimal.valueOf(500000));
        nyTrend.setPriceChangePercentage(5.0); // Initialize with a value
        nyTrend.setDemandScore(75);

        // Los Angeles trends
        PropertyTrend laTrend = new PropertyTrend();
        laTrend.setCity("Los Angeles");
        laTrend.setPropertyType("House");
        laTrend.setTrendDate(LocalDateTime.now().minusDays(7));
        laTrend.setAveragePrice(BigDecimal.valueOf(800000));
        laTrend.setPriceChangePercentage(3.5); // Initialize with a value
        laTrend.setDemandScore(80);

        // Chicago trends
        PropertyTrend chicagoTrend = new PropertyTrend();
        chicagoTrend.setCity("Chicago");
        chicagoTrend.setPropertyType("Condo");
        chicagoTrend.setTrendDate(LocalDateTime.now().minusDays(7));
        chicagoTrend.setAveragePrice(BigDecimal.valueOf(300000));
        chicagoTrend.setPriceChangePercentage(2.0); // Initialize with a value
        chicagoTrend.setDemandScore(70);

        propertyTrendRepository.saveAll(Arrays.asList(nyTrend, laTrend, chicagoTrend));
    }
}