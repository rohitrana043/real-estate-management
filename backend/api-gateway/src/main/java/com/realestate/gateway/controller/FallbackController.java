package com.realestate.gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/property")
    public Mono<String> propertyServiceFallback() {
        return Mono.just("Property Service is currently unavailable. Please try again later.");
    }

    @GetMapping("/user")
    public Mono<String> userServiceFallback() {
        return Mono.just("User Service is currently unavailable. Please try again later.");
    }

    @GetMapping("/transaction")
    public Mono<String> transactionServiceFallback() {
        return Mono.just("Transaction Service is currently unavailable. Please try again later.");
    }

    @GetMapping("/analytics")
    public Mono<String> analyticsServiceFallback() {
        return Mono.just("Analytics Service is currently unavailable. Please try again later.");
    }

    @GetMapping("/default")
    public Mono<String> defaultFallback() {
        return Mono.just("The service is currently unavailable. Please try again later.");
    }
}