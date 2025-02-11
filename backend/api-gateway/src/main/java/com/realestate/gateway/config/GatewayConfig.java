package com.realestate.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("property-service", r -> r
                        .path("/api/properties/**")
                        .uri("lb://property-service"))
                .route("user-service", r -> r
                        .path("/api/users/**", "/api/auth/**")
                        .uri("lb://user-service"))
                .route("transaction-service", r -> r
                        .path("/api/transactions/**")
                        .uri("lb://transaction-service"))
                .route("analytics-service", r -> r
                        .path("/api/analytics/**")
                        .uri("lb://analytics-service"))
                .build();
    }
}