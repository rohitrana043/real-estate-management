package com.realestate.analytics.service;

import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyTrendDTO;
import com.realestate.analytics.model.Analytics;
import com.realestate.analytics.model.PropertyTrend;
import com.realestate.analytics.repository.AnalyticsRepository;
import com.realestate.analytics.repository.PropertyTrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {
    private final AnalyticsRepository analyticsRepository;
    private final PropertyTrendRepository propertyTrendRepository;

    @Override
    @Transactional
    public AnalyticsDTO generateAnalytics(String city, String propertyType) {
        // Get previous analytics for comparison
        List<Analytics> historicalData = analyticsRepository.findByCity(city);
        Analytics previousAnalytics = historicalData.isEmpty() ? null :
                historicalData.get(historicalData.size() - 1);

        // Create new analytics
        Analytics analytics = new Analytics();
        analytics.setCity(city);
        analytics.setPropertyType(propertyType);
        analytics.setReportDate(LocalDateTime.now());

        if (previousAnalytics != null) {
            // Update based on previous data
            analytics.setTotalProperties(previousAnalytics.getTotalProperties());
            analytics.setAvailableProperties(previousAnalytics.getAvailableProperties());
            analytics.setSoldProperties(
                    previousAnalytics.getSoldProperties() +
                            (previousAnalytics.getAvailableProperties() - analytics.getAvailableProperties())
            );

            // Calculate new revenue based on average price and newly sold properties
            BigDecimal newRevenue = previousAnalytics.getAveragePrice()
                    .multiply(BigDecimal.valueOf(analytics.getSoldProperties() - previousAnalytics.getSoldProperties()));
            analytics.setTotalRevenue(previousAnalytics.getTotalRevenue().add(newRevenue));
        } else {
            // Initialize with default values for new city/property type
            analytics.setTotalProperties(0);
            analytics.setAvailableProperties(0);
            analytics.setSoldProperties(0);
            analytics.setTotalRevenue(BigDecimal.ZERO);
            analytics.setAveragePrice(BigDecimal.ZERO);
        }

        // Calculate average price
        analytics.setAveragePrice(calculateAveragePrice(
                analytics.getTotalRevenue(),
                analytics.getSoldProperties()
        ));

        Analytics savedAnalytics = analyticsRepository.save(analytics);
        generatePropertyTrend(city, propertyType, savedAnalytics, previousAnalytics);

        return convertToDTO(savedAnalytics);
    }

    private Integer calculateTotalProperties(List<Analytics> historicalData) {
        return historicalData.stream()
                .mapToInt(Analytics::getTotalProperties)
                .sum();
    }

    private Integer calculateAvailableProperties(List<Analytics> historicalData) {
        return historicalData.stream()
                .mapToInt(Analytics::getAvailableProperties)
                .sum();
    }

    private Integer calculateSoldProperties(List<Analytics> historicalData) {
        return historicalData.stream()
                .mapToInt(Analytics::getSoldProperties)
                .sum();
    }

    private BigDecimal calculateTotalRevenue(List<Analytics> historicalData) {
        return historicalData.stream()
                .map(Analytics::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateAveragePrice(BigDecimal totalRevenue, Integer soldProperties) {
        if (soldProperties == null || soldProperties == 0) {
            return BigDecimal.ZERO;
        }
        return totalRevenue.divide(BigDecimal.valueOf(soldProperties), 2, RoundingMode.HALF_UP);
    }
    private void generatePropertyTrend(String city, String propertyType,
                                       Analytics currentAnalytics, Analytics previousAnalytics) {
        PropertyTrend trend = new PropertyTrend();
        trend.setCity(city);
        trend.setPropertyType(propertyType);
        trend.setTrendDate(LocalDateTime.now());
        trend.setAveragePrice(currentAnalytics.getAveragePrice());

        // Calculate price change percentage
        if (previousAnalytics != null && previousAnalytics.getAveragePrice().compareTo(BigDecimal.ZERO) > 0) {
            double priceChange = calculatePriceChangePercentage(
                    previousAnalytics.getAveragePrice(),
                    currentAnalytics.getAveragePrice()
            );
            trend.setPriceChangePercentage(priceChange);
        } else {
            trend.setPriceChangePercentage(0.0);
        }

        // Calculate demand score
        trend.setDemandScore(calculateDemandScore(currentAnalytics));

        propertyTrendRepository.save(trend);
    }

    private double calculatePriceChangePercentage(BigDecimal oldPrice, BigDecimal newPrice) {
        if (oldPrice.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return newPrice.subtract(oldPrice)
                .divide(oldPrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

//    private int calculateDemandScore(Analytics analytics) {
//        if (analytics.getTotalProperties() == 0) return 0;
//
//        double soldRatio = (double) analytics.getSoldProperties() / analytics.getTotalProperties();
//        return (int) (soldRatio * 100);
//    }
    private int calculateDemandScore(Analytics analytics) {
        if (analytics.getTotalProperties() == null || analytics.getTotalProperties() == 0) {
            return 0;
        }

        // Calculate demand score based on:
        // 1. Sold properties ratio (60% weight)
        // 2. Available properties ratio (40% weight)
        double soldRatio = (double) analytics.getSoldProperties() / analytics.getTotalProperties();
        double availableRatio = (double) analytics.getAvailableProperties() / analytics.getTotalProperties();

        int soldScore = (int) (soldRatio * 60);
        int availabilityScore = (int) ((1 - availableRatio) * 40); // Lower availability means higher demand

        return soldScore + availabilityScore;
    }

    @Cacheable(value = "cityAnalytics", key = "#city", unless = "#result == null")
    @Override
    public List<AnalyticsDTO> getAnalyticsByCity(String city) {
        log.debug("Fetching analytics for city: {}", city);
        return analyticsRepository.findByCity(city).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "propertyTypeAnalytics", key = "#propertyType", unless = "#result == null")
    @Override
    public List<AnalyticsDTO> getAnalyticsByPropertyType(String propertyType) {
        log.debug("Fetching analytics for property type: {}", propertyType);
        return analyticsRepository.findByPropertyType(propertyType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AnalyticsDTO> getAnalyticsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Fetching analytics between {} and {}", startDate, endDate);
        return analyticsRepository.findAnalyticsInDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @CachePut(value = "propertyTrends", key = "#city + '-' + #propertyType")
    @Override
    public List<PropertyTrendDTO> getPropertyTrends(String city, String propertyType) {
        log.debug("Fetching property trends for city: {} and property type: {}", city, propertyType);
        List<PropertyTrend> trends;
        if (city != null && !city.isEmpty()) {
            trends = propertyTrendRepository.findByCityOrderByTrendDateDesc(city);
        } else if (propertyType != null && !propertyType.isEmpty()) {
            trends = propertyTrendRepository.findByPropertyTypeOrderByTrendDateDesc(propertyType);
        } else {
            trends = propertyTrendRepository.findAll();
        }

        return trends.stream()
                .map(this::convertToTrendDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "dashboardStats", unless = "#result == null")
    @Override
    public Map<String, Object> getDashboardStats() {
        log.debug("Generating dashboard statistics");
        Map<String, Object> stats = new HashMap<>();

        // Get latest analytics
        List<Analytics> recentAnalytics = analyticsRepository.findAnalyticsInDateRange(
                LocalDateTime.now().minusDays(30),
                LocalDateTime.now()
        );

        // Calculate key metrics
        int totalProperties = calculateTotalProperties(recentAnalytics);

        int availableProperties = calculateAvailableProperties(recentAnalytics);

        int soldProperties = calculateSoldProperties(recentAnalytics);

        BigDecimal totalRevenue = calculateTotalRevenue(recentAnalytics);

        stats.put("totalProperties", totalProperties);
        stats.put("totalRevenue", totalRevenue);
        stats.put("soldProperties", soldProperties);
        stats.put("availableProperties", availableProperties);

        // Add trend information
        List<PropertyTrend> recentTrends = propertyTrendRepository
                .findAll().stream()
                .filter(trend -> trend.getTrendDate().isAfter(LocalDateTime.now().minusDays(30)))
                .collect(Collectors.toList());

        stats.put("averageDemandScore", calculateAverageDemandScore(recentTrends));
        stats.put("averagePriceChange", calculateAveragePriceChange(recentTrends));
        stats.put("occupancyRate", calculateOccupancyRate(totalProperties, availableProperties));
        stats.put("averagePrice", calculateAveragePrice(totalRevenue, soldProperties));

        return stats;
    }

    private double calculateOccupancyRate(int totalProperties, int availableProperties) {
        if (totalProperties == 0) return 0.0;
        return ((double)(totalProperties - availableProperties) / totalProperties) * 100;
    }
    private double calculateAverageDemandScore(List<PropertyTrend> trends) {
        return trends.stream()
                .mapToInt(PropertyTrend::getDemandScore)
                .average()
                .orElse(0.0);
    }

    private double calculateAveragePriceChange(List<PropertyTrend> trends) {
        return trends.stream()
                .filter(trend -> trend.getPriceChangePercentage() != null)
                .mapToDouble(PropertyTrend::getPriceChangePercentage)
                .average()
                .orElse(0.0);
    }

    private AnalyticsDTO convertToDTO(Analytics analytics) {
        AnalyticsDTO dto = new AnalyticsDTO();
        BeanUtils.copyProperties(analytics, dto);
        return dto;
    }

    private PropertyTrendDTO convertToTrendDTO(PropertyTrend trend) {
        PropertyTrendDTO dto = new PropertyTrendDTO();
        BeanUtils.copyProperties(trend, dto);
        return dto;
    }

    @CacheEvict(value = {
            "cityAnalytics",
            "propertyTypeAnalytics",
            "propertyTrends",
            "dashboardStats"
    }, allEntries = true)
    @Scheduled(fixedRate = 3600000) // Every hour
    public void clearCache() {
        // This method will clear all caches
        log.info("Cleared all caches");
    }
}