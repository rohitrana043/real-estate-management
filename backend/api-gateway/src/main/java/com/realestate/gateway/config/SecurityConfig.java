package com.realestate.gateway.config;

import com.realestate.gateway.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.header.XFrameOptionsServerHttpHeadersWriter;
import org.springframework.web.server.WebFilter;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions
                                .mode(XFrameOptionsServerHttpHeadersWriter.Mode.DENY))
                )
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Health endpoints
                        .pathMatchers("/actuator/health/**", "/actuator/info").permitAll()

                        // Public API endpoints
                        .pathMatchers("/api/auth/**", "/auth/**").permitAll()
                        .pathMatchers("/api-docs", "/api/public/**", "/api/docs/**").permitAll()
                        .pathMatchers("/api/contacts/**", "/contacts/**").permitAll()
                        .pathMatchers("/api/newsletter/**", "/newsletter/**").permitAll()
                        .pathMatchers("/api/account/verify/**").permitAll()

                        // Public property endpoints - ONLY listing and search, not individual properties
                        .pathMatchers(HttpMethod.GET, "/api/properties").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/properties/search").permitAll()

                        // Debug endpoints
                        .pathMatchers("/debug/**").permitAll()

                        // Other static resources
                        .pathMatchers("/", "/fallback/**", "/error", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Everything else needs authentication
                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .build();
    }

    /**
     * Add a security header filter
     */
    @Bean
    public WebFilter securityHeadersFilter() {
        return (exchange, chain) -> {
            exchange.getResponse().getHeaders().add("X-Content-Type-Options", "nosniff");
            exchange.getResponse().getHeaders().add("X-XSS-Protection", "1; mode=block");
            return chain.filter(exchange);
        };
    }
}
