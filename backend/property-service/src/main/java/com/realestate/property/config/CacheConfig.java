package com.realestate.property.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCacheNames(Arrays.asList(
                "properties",
                "propertyImages",
                "images"
        ));

        // For production, use more sophisticated caching settings
        if ("prod".equals(activeProfile)) {
            cacheManager.setCaffeine(Caffeine.newBuilder()
                    .maximumSize(500)
                    .expireAfterAccess(60, TimeUnit.MINUTES)
                    .recordStats());
        } else {
            // For development/testing, use simpler cache settings
            cacheManager.setCaffeine(Caffeine.newBuilder()
                    .maximumSize(100)
                    .expireAfterAccess(5, TimeUnit.MINUTES)
                    .recordStats());
        }

        return cacheManager;
    }
}