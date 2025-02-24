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
                // Auth Service Routes (no JWT filter)
                .route("user-service", r -> r
                        .path("/api/auth/**", "/auth/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("authCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/auth")))
                        .uri("lb://user-service"))
                .route("contact-service", r -> r
                        .path("/api/contacts/**", "/contacts/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("contactCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/contact")))
                        .uri("lb://contact-service"))
                .route("contact-service", r -> r
                        .path("/api/newsletter/**", "/newsletter/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("newsletterCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/contact")))
                        .uri("lb://contact-service"))
                .route("property-service", r -> r
                        .path("/api/properties/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("propertyCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/property")))
                        .uri("lb://property-service"))
                .route("user-service", r -> r
                        .path("/api/users/**", "/api/account/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("userCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/user")))
                        .uri("lb://user-service"))
//                .route("transaction-service", r -> r
//                        .path("/api/transactions/**")
//                        .filters(f -> f
//                                .circuitBreaker(config -> config
//                                        .setName("transactionCircuitBreaker")
//                                        .setFallbackUri("forward:/fallback/transaction")))
//                        .uri("lb://transaction-service"))
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