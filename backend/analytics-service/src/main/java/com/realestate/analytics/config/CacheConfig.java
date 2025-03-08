package com.realestate.analytics.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    @Profile("!prod")
    @Primary
    public CacheManager defaultCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCacheNames(Arrays.asList(
                "cityAnalytics",
                "propertyTypeAnalytics",
                "propertyTrends",
                "dashboardStats",
                "properties",
                "availableCities",
                "availablePropertyTypes"
        ));

        // Development-optimized cache settings
        Caffeine<Object, Object> caffeine = Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .expireAfterAccess(15, TimeUnit.MINUTES)
                .recordStats(); // For monitoring

        cacheManager.setCaffeine(caffeine);
        return cacheManager;
    }

    @Bean
    @Profile("prod")
    @Primary
    public CacheManager productionCacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCacheNames(Arrays.asList(
                "cityAnalytics",
                "propertyTypeAnalytics",
                "propertyTrends",
                "dashboardStats",
                "properties",
                "availableCities",
                "availablePropertyTypes"
        ));

        // Production-optimized cache settings
        Caffeine<Object, Object> caffeine = Caffeine.newBuilder()
                .maximumSize(2000)
                .expireAfterWrite(60, TimeUnit.MINUTES)
                .expireAfterAccess(30, TimeUnit.MINUTES)
                .recordStats(); // For monitoring

        cacheManager.setCaffeine(caffeine);
        return cacheManager;
    }
}