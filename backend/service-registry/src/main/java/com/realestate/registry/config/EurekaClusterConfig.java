package com.realestate.registry.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
@Profile("prod")
public class EurekaClusterConfig {

    @Value("${eureka.instance.hostname}")
    private String hostname;

    @Value("${spring.security.user.name}")
    private String username;

    @Value("${spring.security.user.password}")
    private String password;

    @PostConstruct
    public void validateClusterConfig() throws UnknownHostException {
        // Validate hostname resolution
        InetAddress.getByName(hostname);

        // Validate required properties
        if (username == null || password == null) {
            throw new IllegalStateException("Eureka security credentials must be configured");
        }
    }
}