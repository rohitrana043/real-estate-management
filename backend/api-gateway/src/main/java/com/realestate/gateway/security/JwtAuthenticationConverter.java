package com.realestate.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationConverter implements ServerAuthenticationConverter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    public Mono<Authentication> convert(ServerWebExchange exchange) {
        // Get the auth header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String path = exchange.getRequest().getPath().value();
        String method = exchange.getRequest().getMethod().name();

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Mono.empty();
        }

        String token = authHeader.substring(7);

        try {
            // Parse and verify the JWT token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();

            // Extract roles from claims if available
            List<SimpleGrantedAuthority> authorities;
            if (claims.get("roles") != null) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) claims.get("roles");
                authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());
            } else {
                // Default role if no roles are specified in the token
                authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
            }

            // Create and return the Authentication object
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    authorities
            );
            return Mono.just(auth);
        } catch (Exception e) {
            return Mono.empty();
        }
    }
}
