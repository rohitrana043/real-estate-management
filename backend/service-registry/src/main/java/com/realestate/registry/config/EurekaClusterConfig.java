package com.realestate.registry.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Configuration
//@Profile("prod")
public class EurekaClusterConfig {

    @Value("${eureka.instance.hostname}")
    private String hostname;

    @Value("${spring.security.user.name}")
    private String username;

    @Value("${spring.security.user.password}")
    private String password;

    @Value("${server.port}")
    private int port;

    @PostConstruct
    public void validateClusterConfig() throws UnknownHostException {
        // Validate hostname resolution
        InetAddress address = InetAddress.getByName(hostname);

        // Validate required properties
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalStateException("Eureka username must be configured");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new IllegalStateException("Eureka password must be configured");
        }

        // Validate port
        if (port <= 0) {
            throw new IllegalStateException("Invalid server port configuration");
        }

        // Log successful configuration
        logger.info("Eureka cluster configuration validated successfully");
        logger.info("Hostname resolved to: " + address.getHostAddress());
    }

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(EurekaClusterConfig.class);
}