package com.realestate.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("property-service", r -> r
                        .path("/api/properties/**")
                        .and()
                        .method(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("propertyCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/property")))
                        .uri("lb://property-service"))
                .route("user-service", r -> r
                        .path("/api/users/**", "/api/auth/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("userCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/user")))
                        .uri("lb://user-service"))
                .route("transaction-service", r -> r
                        .path("/api/transactions/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("transactionCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/transaction")))
                        .uri("lb://transaction-service"))
                .route("analytics-service", r -> r
                        .path("/api/analytics/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("analyticsCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/analytics")))
                        .uri("lb://analytics-service"))
                .build();
    }
}