package com.realestate.gateway.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationManager implements ReactiveAuthenticationManager {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationManager.class);

    @Override
    public Mono<Authentication> authenticate(Authentication authentication) {
        logger.debug("Authentication manager processing: {}", authentication.getName());
        return Mono.just(authentication);
    }
}