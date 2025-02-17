package com.realestate.gateway.security;

import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthenticationFilter extends AuthenticationWebFilter {
    public JwtAuthenticationFilter(JwtAuthenticationManager authManager,
                                   JwtAuthenticationConverter authConverter) {
        super(authManager);
        setServerAuthenticationConverter(authConverter);
    }
}