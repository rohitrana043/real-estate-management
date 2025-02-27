package com.realestate.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class AuthenticationHeaderFilter extends AbstractGatewayFilterFactory<AuthenticationHeaderFilter.Config> {

    public AuthenticationHeaderFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            return ReactiveSecurityContextHolder.getContext()
                    .defaultIfEmpty(new SecurityContext() {
                        @Override
                        public Authentication getAuthentication() {
                            return null;
                        }

                        @Override
                        public void setAuthentication(Authentication authentication) {
                            // No-op for empty context
                        }
                    })
                    .map(securityContext -> {
                        Authentication authentication = securityContext.getAuthentication();
                        ServerWebExchange modifiedExchange = exchange;

                        if (authentication != null && authentication.isAuthenticated() &&
                                !"anonymousUser".equals(authentication.getName())) {
                            // Add user email to headers
                            log.debug("Adding authenticated user to headers: {}", authentication.getName());
                            modifiedExchange = exchange.mutate()
                                    .request(r -> r.header("X-User-Email", authentication.getName()))
                                    .build();

                            // Add user roles to headers if available
                            if (authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
                                String roles = authentication.getAuthorities().stream()
                                        .map(authority -> authority.getAuthority())
                                        .reduce((a, b) -> a + "," + b)
                                        .orElse("");

                                log.debug("Adding user roles to headers: {}", roles);
                                modifiedExchange = modifiedExchange.mutate()
                                        .request(r -> r.header("X-User-Roles", roles))
                                        .build();
                            }
                        } else {
                            log.debug("No authenticated user found for header enrichment");
                        }

                        return modifiedExchange;
                    })
                    .flatMap(modifiedExchange -> chain.filter(modifiedExchange));
        };
    }

    public static class Config {
        // Put configuration properties here if needed
    }
}