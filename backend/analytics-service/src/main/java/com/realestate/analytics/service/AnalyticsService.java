package com.realestate.analytics.service;

import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyTrendDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {

    /**
     * Generates analytics for a specific city and property type
     *
     * @param city The city name (must match property data)
     * @param propertyType The property type (e.g., HOUSE, APARTMENT)
     * @return The generated analytics data
     */
    AnalyticsDTO generateAnalytics(String city, String propertyType);

    /**
     * Get analytics data for a specific city
     *
     * @param city The city name
     * @return List of analytics for the city
     */
    List<AnalyticsDTO> getAnalyticsByCity(String city);

    /**
     * Get analytics data for a specific property type
     *
     * @param propertyType The property type
     * @return List of analytics for the property type
     */
    List<AnalyticsDTO> getAnalyticsByPropertyType(String propertyType);

    /**
     * Get analytics data within a date range
     *
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return List of analytics within the date range
     */
    List<AnalyticsDTO> getAnalyticsInDateRange(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Get property trends filtered by city and/or property type
     *
     * @param city The city name (optional)
     * @param propertyType The property type (optional)
     * @return List of property trends
     */
    List<PropertyTrendDTO> getPropertyTrends(String city, String propertyType);

    /**
     * Get comprehensive dashboard statistics
     *
     * @return Map containing dashboard statistics
     */
    Map<String, Object> getDashboardStats();

    /**
     * Get list of all available cities in property data
     *
     * @return List of city names
     */
    List<String> getAvailableCities();

    /**
     * Get list of all available property types in property data
     *
     * @return List of property types
     */
    List<String> getAvailablePropertyTypes();
}