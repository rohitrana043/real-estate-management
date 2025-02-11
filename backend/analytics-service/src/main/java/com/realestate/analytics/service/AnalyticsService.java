package com.realestate.analytics.service;

import com.realestate.analytics.dto.AnalyticsDTO;
import com.realestate.analytics.dto.PropertyTrendDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    AnalyticsDTO generateAnalytics(String city, String propertyType);
    List<AnalyticsDTO> getAnalyticsByCity(String city);
    List<AnalyticsDTO> getAnalyticsByPropertyType(String propertyType);
    List<AnalyticsDTO> getAnalyticsInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    List<PropertyTrendDTO> getPropertyTrends(String city, String propertyType);
    Map<String, Object> getDashboardStats();
}