package com.realestate.property.config;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUserResolver extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
        try {
            // Extract user info from X-User-Email header (if provided by API Gateway)
            String userEmail = request.getHeader("X-User-Email");
            String userRoles = request.getHeader("X-User-Roles");

            if (userEmail != null && !userEmail.isEmpty()) {
                log.debug("Found user email in header: {}", userEmail);

                // Create authorities from roles if available
                Collection<GrantedAuthority> authorities = userRoles != null ?
                        Arrays.stream(userRoles.split(","))
                                .map(role -> new SimpleGrantedAuthority(role.trim()))
                                .collect(Collectors.toList()) :
                        Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));

                // Create authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                log.debug("Set authentication for user: {}", userEmail);
            } else {
                log.debug("No user email found in headers");
            }
        } catch (Exception e) {
            log.error("Could not set user authentication: {}", e.getMessage());
        }

        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Error in filter chain: {}", e.getMessage());
        }
    }
}