package com.realestate.gateway.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;

@Component
public class JwtAuthenticationConverter implements ServerAuthenticationConverter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationConverter.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String path = exchange.getRequest().getPath().value();

        logger.debug("Processing request for path: {}", path);
        logger.debug("Authorization header present: {}", authHeader != null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No Bearer token found in Authorization header");
            return Mono.empty();
        }

        String token = authHeader.substring(7);
        logger.debug("JWT token extracted, attempting validation");

        try {
            String username = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            logger.debug("JWT token validated successfully for user: {}", username);

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"))
            );
            return Mono.just(auth);
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
            return Mono.empty();
        }
    }
}