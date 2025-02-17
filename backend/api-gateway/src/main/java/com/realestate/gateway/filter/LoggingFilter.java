package com.realestate.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Collections;
import java.util.Set;

import static org.springframework.cloud.gateway.support.ServerWebExchangeUtils.*;

@Component
public class LoggingFilter implements GlobalFilter {
    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        Set<URI> uris = exchange.getAttributeOrDefault(GATEWAY_ORIGINAL_REQUEST_URL_ATTR, Collections.emptySet());
        String originalUri = (uris.isEmpty()) ? "Unknown" : uris.iterator().next().toString();
        Route route = exchange.getAttribute(GATEWAY_ROUTE_ATTR);
        URI routeUri = exchange.getAttribute(GATEWAY_REQUEST_URL_ATTR);

        logger.debug("Incoming request {} is routed to id: {}, uri: {}",
                originalUri,
                route != null ? route.getId() : "Unknown",
                routeUri);

        // Log request headers
        exchange.getRequest().getHeaders().forEach((name, values) -> {
            values.forEach(value -> logger.debug("Request Header {}: {}", name, value));
        });

        // Log request parameters
        exchange.getRequest().getQueryParams().forEach((name, values) -> {
            values.forEach(value -> logger.debug("Request Parameter {}: {}", name, value));
        });

        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    logger.debug("Response status: {}", exchange.getResponse().getStatusCode());
                    // Log response headers
                    exchange.getResponse().getHeaders().forEach((name, values) -> {
                        values.forEach(value -> logger.debug("Response Header {}: {}", name, value));
                    });
                }));
    }
}