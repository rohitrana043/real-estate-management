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
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives("default-src 'self'; frame-ancestors 'none'"))
                        .cache(cache -> cache
                                .disable())
                )
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/actuator/health/**").permitAll()
                        .pathMatchers("/actuator/info").permitAll()
                        .pathMatchers("/actuator/**").hasRole("ADMIN")
                        .pathMatchers("/",
                                "/api-docs",
                                "/api/public/**",
                                "/api/docs/**",
                                "/api/auth/**",
                                "/api/contacts/**",
                                "/api/newsletter/**",
                                "/api/account/verify/**",
                                "/api/properties",
                                "/api/properties/search",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/fallback/**").permitAll()
                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .build();
    }

    /**
     * Add a production-grade security header filter
     */
    @Bean
    public WebFilter securityHeadersFilter() {
        return (exchange, chain) -> {
            exchange.getResponse().getHeaders().add("X-Content-Type-Options", "nosniff");
            exchange.getResponse().getHeaders().add("X-XSS-Protection", "1; mode=block");
            exchange.getResponse().getHeaders().add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            return chain.filter(exchange);
        };
    }
}