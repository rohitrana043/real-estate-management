package com.realestate.analytics.service;

import com.realestate.analytics.client.PropertiesServiceClient;
import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyDTO;
import com.realestate.analytics.dto.PropertySearchResponse;
import com.realestate.analytics.dto.PropertyTrendDTO;
import com.realestate.analytics.model.Analytics;
import com.realestate.analytics.model.PropertyTrend;
import com.realestate.analytics.repository.AnalyticsRepository;
import com.realestate.analytics.repository.PropertyTrendRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {
    private final AnalyticsRepository analyticsRepository;
    private final PropertyTrendRepository propertyTrendRepository;
    private final PropertiesServiceClient propertiesClient;

    @Override
    @Transactional
    public AnalyticsDTO generateAnalytics(String city, String propertyType) {
        log.info("Generating analytics for city: {} and property type: {}", city, propertyType);

        // Get previous analytics for comparison
        List<Analytics> historicalData = analyticsRepository.findByCityAndPropertyType(city, propertyType);
        Analytics previousAnalytics = historicalData.isEmpty() ? null :
                historicalData.get(historicalData.size() - 1);

        // Fetch real property data
        List<PropertyDTO> properties = fetchProperties(city, propertyType);
        log.info("Fetched {} properties for analytics", properties.size());

        // Create new analytics
        Analytics analytics = new Analytics();
        analytics.setCity(city);
        analytics.setPropertyType(propertyType);
        analytics.setReportDate(LocalDateTime.now());

        // Calculate analytics from real property data
        int totalProperties = properties.size();
        int availableProperties = (int) properties.stream()
                .filter(p -> "AVAILABLE".equals(p.getStatus()))
                .count();
        int soldProperties = (int) properties.stream()
                .filter(p -> "SOLD".equals(p.getStatus()))
                .count();

        BigDecimal totalRevenue = properties.stream()
                .filter(p -> "SOLD".equals(p.getStatus()))
                .map(PropertyDTO::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averagePrice;
        if (soldProperties > 0) {
            averagePrice = totalRevenue.divide(BigDecimal.valueOf(soldProperties), 2, RoundingMode.HALF_UP);
        } else {
            averagePrice = properties.stream()
                    .map(PropertyDTO::getPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(Math.max(1, totalProperties)), 2, RoundingMode.HALF_UP);
        }

        analytics.setTotalProperties(totalProperties);
        analytics.setAvailableProperties(availableProperties);
        analytics.setSoldProperties(soldProperties);
        analytics.setTotalRevenue(totalRevenue);
        analytics.setAveragePrice(averagePrice);

        Analytics savedAnalytics = analyticsRepository.save(analytics);
        generatePropertyTrend(city, propertyType, savedAnalytics, previousAnalytics, properties);

        return convertToDTO(savedAnalytics);
    }

    private List<PropertyDTO> fetchProperties(String city, String propertyType) {
        log.debug("Fetching properties for city: {} and type: {}", city, propertyType);

        try {
            // Get all properties (we'll filter client-side)
            PropertySearchResponse allProperties = propertiesClient.getAllProperties(0, 1000);
            List<PropertyDTO> properties = allProperties.getContent();

            if (properties.isEmpty()) {
                log.warn("No properties found in the properties service");
                return properties;
            }

            // Filter properties by city and type
            return properties.stream()
                    .filter(p -> (city == null || city.isEmpty() || city.equalsIgnoreCase(p.getCity())))
                    .filter(p -> (propertyType == null || propertyType.isEmpty() || propertyType.equalsIgnoreCase(p.getType())))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching properties for city: {} and type: {}", city, propertyType, e);
            return Collections.emptyList();
        }
    }

    private void generatePropertyTrend(String city, String propertyType,
                                       Analytics currentAnalytics, Analytics previousAnalytics,
                                       List<PropertyDTO> properties) {
        if (city == null || city.isEmpty()) {
            log.warn("Cannot generate property trend with null city. Skipping trend generation.");
            return;
        }

        if (propertyType == null || propertyType.isEmpty()) {
            log.warn("Cannot generate property trend with null propertyType. Skipping trend generation.");
            return;
        }

        log.debug("Generating property trend for city: {} and property type: {}", city, propertyType);

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

        // Calculate demand score based on available vs. sold properties
        trend.setDemandScore(calculateDemandScore(properties));

        propertyTrendRepository.save(trend);
        log.debug("Saved property trend for city: {} and property type: {}", city, propertyType);
    }

    private double calculatePriceChangePercentage(BigDecimal oldPrice, BigDecimal newPrice) {
        if (oldPrice.compareTo(BigDecimal.ZERO) == 0) return 0.0;
        return newPrice.subtract(oldPrice)
                .divide(oldPrice, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private int calculateDemandScore(List<PropertyDTO> properties) {
        if (properties.isEmpty()) return 0;

        // Calculate the ratio of sold to available properties
        long totalProperties = properties.size();
        long soldProperties = properties.stream()
                .filter(p -> "SOLD".equals(p.getStatus()))
                .count();

        // Calculate days on market (if we had that data)
        // For now, use a simple ratio as demand indicator
        double soldRatio = (double) soldProperties / totalProperties;

        // Add weight to recent sales if we had timestamp data
        // For now use a simple score
        return (int) (soldRatio * 100);
    }

    @Cacheable(value = "cityAnalytics", key = "#city", unless = "#result == null")
    @Override
    public List<AnalyticsDTO> getAnalyticsByCity(String city) {
        log.debug("Fetching analytics for city: {}", city);
        List<Analytics> cityAnalytics = analyticsRepository.findByCity(city);

        // If no existing analytics found, generate new ones
        if (cityAnalytics.isEmpty()) {
            AnalyticsDTO newAnalytics = generateAnalytics(city, null);
            return Collections.singletonList(newAnalytics);
        }

        return cityAnalytics.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "propertyTypeAnalytics", key = "#propertyType", unless = "#result == null")
    @Override
    public List<AnalyticsDTO> getAnalyticsByPropertyType(String propertyType) {
        log.debug("Fetching analytics for property type: {}", propertyType);
        List<Analytics> typeAnalytics = analyticsRepository.findByPropertyType(propertyType);

        // If no existing analytics found, generate new ones
        if (typeAnalytics.isEmpty()) {
            AnalyticsDTO newAnalytics = generateAnalytics(null, propertyType);
            return Collections.singletonList(newAnalytics);
        }

        return typeAnalytics.stream()
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

        // First, check if we need to generate fresh analytics
        if (shouldGenerateFreshAnalytics(city, propertyType)) {
            generateAnalytics(city, propertyType);
        }

        // Now fetch the trends
        List<PropertyTrend> trends;
        if (city != null && !city.isEmpty() && propertyType != null && !propertyType.isEmpty()) {
            trends = propertyTrendRepository.findByCityAndPropertyTypeOrderByTrendDateDesc(city, propertyType);
        } else if (city != null && !city.isEmpty()) {
            trends = propertyTrendRepository.findByCityOrderByTrendDateDesc(city);
        } else if (propertyType != null && !propertyType.isEmpty()) {
            trends = propertyTrendRepository.findByPropertyTypeOrderByTrendDateDesc(propertyType);
        } else {
            trends = propertyTrendRepository.findAllByOrderByTrendDateDesc();
        }

        return trends.stream()
                .map(this::convertToTrendDTO)
                .collect(Collectors.toList());
    }

    private boolean shouldGenerateFreshAnalytics(String city, String propertyType) {
        // Look for the latest analytics
        List<PropertyTrend> trends;

        if (city != null && !city.isEmpty() && propertyType != null && !propertyType.isEmpty()) {
            trends = propertyTrendRepository.findByCityAndPropertyTypeOrderByTrendDateDesc(city, propertyType);
        } else if (city != null && !city.isEmpty()) {
            trends = propertyTrendRepository.findByCityOrderByTrendDateDesc(city);
        } else if (propertyType != null && !propertyType.isEmpty()) {
            trends = propertyTrendRepository.findByPropertyTypeOrderByTrendDateDesc(propertyType);
        } else {
            trends = propertyTrendRepository.findAllByOrderByTrendDateDesc();
        }

        // If no trends or the latest trend is older than 1 day, generate fresh analytics
        return trends.isEmpty() || trends.get(0).getTrendDate().isBefore(LocalDateTime.now().minusDays(1));
    }

    @Cacheable(value = "dashboardStats", unless = "#result == null")
    @Override
    public Map<String, Object> getDashboardStats() {
        log.debug("Generating dashboard statistics");
        Map<String, Object> stats = new HashMap<>();

        // Fetch property data for dashboard
        PropertySearchResponse allProperties = propertiesClient.getAllProperties(0, 1000);
        List<PropertyDTO> properties = allProperties.getContent();

        // Calculate key metrics
        int totalProperties = properties.size();
        int availableProperties = (int) properties.stream()
                .filter(p -> "AVAILABLE".equals(p.getStatus()))
                .count();
        int soldProperties = (int) properties.stream()
                .filter(p -> "SOLD".equals(p.getStatus()))
                .count();
        int rentedProperties = (int) properties.stream()
                .filter(p -> "RENTED".equals(p.getStatus()))
                .count();

        BigDecimal totalRevenue = properties.stream()
                .filter(p -> "SOLD".equals(p.getStatus()))
                .map(PropertyDTO::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate property type distribution
        Map<String, Long> propertyTypeDistribution = properties.stream()
                .collect(Collectors.groupingBy(PropertyDTO::getType, Collectors.counting()));

        // Calculate city distribution
        Map<String, Long> cityDistribution = properties.stream()
                .collect(Collectors.groupingBy(PropertyDTO::getCity, Collectors.counting()));

        // Calculate price ranges
        Map<String, Long> priceRanges = calculatePriceRanges(properties);

        // Calculate monthly trends
        Map<String, Integer> monthlyListings = calculateMonthlyListings(properties);

        // Add stats to the response
        stats.put("totalProperties", totalProperties);
        stats.put("availableProperties", availableProperties);
        stats.put("soldProperties", soldProperties);
        stats.put("rentedProperties", rentedProperties);
        stats.put("totalRevenue", totalRevenue);
        stats.put("propertyTypeDistribution", propertyTypeDistribution);
        stats.put("cityDistribution", cityDistribution);
        stats.put("priceRanges", priceRanges);
        stats.put("monthlyListings", monthlyListings);
        stats.put("occupancyRate", calculateOccupancyRate(totalProperties, availableProperties));
        stats.put("averagePrice", calculateAveragePrice(properties));
        stats.put("averagePriceByType", calculateAveragePriceByType(properties));
        stats.put("recentTrends", getRecentTrends());

        return stats;
    }

    private Map<String, Long> calculatePriceRanges(List<PropertyDTO> properties) {
        Map<String, Long> priceRanges = new LinkedHashMap<>();

        long under250k = properties.stream()
                .filter(p -> p.getPrice().compareTo(BigDecimal.valueOf(250000)) < 0)
                .count();

        long from250kTo500k = properties.stream()
                .filter(p -> p.getPrice().compareTo(BigDecimal.valueOf(250000)) >= 0 &&
                        p.getPrice().compareTo(BigDecimal.valueOf(500000)) < 0)
                .count();

        long from500kTo750k = properties.stream()
                .filter(p -> p.getPrice().compareTo(BigDecimal.valueOf(500000)) >= 0 &&
                        p.getPrice().compareTo(BigDecimal.valueOf(750000)) < 0)
                .count();

        long from750kTo1M = properties.stream()
                .filter(p -> p.getPrice().compareTo(BigDecimal.valueOf(750000)) >= 0 &&
                        p.getPrice().compareTo(BigDecimal.valueOf(1000000)) < 0)
                .count();

        long over1M = properties.stream()
                .filter(p -> p.getPrice().compareTo(BigDecimal.valueOf(1000000)) >= 0)
                .count();

        priceRanges.put("Under $250k", under250k);
        priceRanges.put("$250k-$500k", from250kTo500k);
        priceRanges.put("$500k-$750k", from500kTo750k);
        priceRanges.put("$750k-$1M", from750kTo1M);
        priceRanges.put("Over $1M", over1M);

        return priceRanges;
    }

    private Map<String, Integer> calculateMonthlyListings(List<PropertyDTO> properties) {
        // This would be more accurate if we had the created date
        // For now, just create sample data
        Map<String, Integer> monthlyListings = new LinkedHashMap<>();

        // Get the last 6 months
        LocalDate today = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = today.minusMonths(i);
            String monthName = month.getMonth().toString();

            // For demo purposes, assign a count
            // In a real scenario, you would filter by creation date
            int count = 10 + (int)(Math.random() * 30);
            monthlyListings.put(monthName, count);
        }

        return monthlyListings;
    }

    private double calculateOccupancyRate(int totalProperties, int availableProperties) {
        if (totalProperties == 0) return 0.0;
        return ((double)(totalProperties - availableProperties) / totalProperties) * 100;
    }

    private BigDecimal calculateAveragePrice(List<PropertyDTO> properties) {
        if (properties.isEmpty()) return BigDecimal.ZERO;

        BigDecimal totalPrice = properties.stream()
                .map(PropertyDTO::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalPrice.divide(BigDecimal.valueOf(properties.size()), 2, RoundingMode.HALF_UP);
    }

    private Map<String, BigDecimal> calculateAveragePriceByType(List<PropertyDTO> properties) {
        return properties.stream()
                .collect(Collectors.groupingBy(
                        PropertyDTO::getType,
                        Collectors.mapping(
                                PropertyDTO::getPrice,
                                Collectors.reducing(
                                        BigDecimal.ZERO,
                                        BigDecimal::add
                                )
                        )
                ))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            long count = properties.stream()
                                    .filter(p -> entry.getKey().equals(p.getType()))
                                    .count();

                            return entry.getValue().divide(
                                    BigDecimal.valueOf(Math.max(1, count)),
                                    2,
                                    RoundingMode.HALF_UP
                            );
                        }
                ));
    }

    private List<Map<String, Object>> getRecentTrends() {
        // Get the most recent property trends
        List<PropertyTrend> recentTrends = propertyTrendRepository.findAllByOrderByTrendDateDesc();

        if (recentTrends.isEmpty()) {
            return Collections.emptyList();
        }

        return recentTrends.stream()
                .limit(5)  // Get only the 5 most recent trends
                .map(trend -> {
                    Map<String, Object> trendMap = new HashMap<>();
                    trendMap.put("city", trend.getCity());
                    trendMap.put("propertyType", trend.getPropertyType());
                    trendMap.put("averagePrice", trend.getAveragePrice());
                    trendMap.put("priceChangePercentage", trend.getPriceChangePercentage());
                    trendMap.put("demandScore", trend.getDemandScore());
                    trendMap.put("trendDate", trend.getTrendDate());
                    return trendMap;
                })
                .collect(Collectors.toList());
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

    @Override
    public List<String> getAvailableCities() {
        try {
            // Fetch properties
            PropertySearchResponse response = propertiesClient.getAllProperties(0, 1000);

            if (response != null && response.getContent() != null) {
                // Extract unique city names and sort them
                return response.getContent().stream()
                        .map(PropertyDTO::getCity)
                        .filter(city -> city != null && !city.isEmpty())
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList());
            }

            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching available cities", e);
            return Collections.emptyList();
        }
    }

    @Override
    public List<String> getAvailablePropertyTypes() {
        try {
            // Fetch properties
            PropertySearchResponse response = propertiesClient.getAllProperties(0, 1000);

            if (response != null && response.getContent() != null) {
                // Extract unique property types and sort them
                return response.getContent().stream()
                        .map(PropertyDTO::getType)
                        .filter(type -> type != null && !type.isEmpty())
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList());
            }

            return Collections.emptyList();
        } catch (Exception e) {
            log.error("Error fetching available property types", e);
            return Collections.emptyList();
        }
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
        log.info("Cleared all analytics caches");
    }

    @Scheduled(cron = "0 0 0 * * ?") // Every day at midnight
    public void generateDailyAnalytics() {
        log.info("Starting scheduled daily analytics generation");

        try {
            // Get all properties
            PropertySearchResponse response = propertiesClient.getAllProperties(0, 1000);
            List<PropertyDTO> properties = response.getContent();

            if (properties.isEmpty()) {
                log.warn("No properties found. Skipping analytics generation.");
                return;
            }

            log.info("Found {} properties for analysis", properties.size());

            // Get distinct cities
            Set<String> cities = properties.stream()
                    .map(PropertyDTO::getCity)
                    .filter(city -> city != null && !city.isEmpty())
                    .collect(Collectors.toSet());

            log.info("Found cities: {}", cities);

            // Get distinct property types
            Set<String> propertyTypes = properties.stream()
                    .map(PropertyDTO::getType)
                    .filter(type -> type != null && !type.isEmpty())
                    .collect(Collectors.toSet());

            log.info("Found property types: {}", propertyTypes);

            // Generate analytics for each city and property type combination
            for (String city : cities) {
                for (String propertyType : propertyTypes) {
                    try {
                        log.info("Generating analytics for city: {} and type: {}", city, propertyType);
                        generateAnalytics(city, propertyType);
                    } catch (Exception e) {
                        log.error("Error generating analytics for city: {} and type: {}", city, propertyType, e);
                    }
                }
            }

            log.info("Completed scheduled daily analytics generation");
        } catch (Exception e) {
            log.error("Error in scheduled daily analytics generation", e);
        }
    }
}