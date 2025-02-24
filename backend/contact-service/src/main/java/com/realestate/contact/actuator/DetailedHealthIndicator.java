package com.realestate.contact.actuator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Component
public class DetailedHealthIndicator implements HealthIndicator {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public Health health() {
        Map<String, Object> details = new HashMap<>();
        boolean isHealthy = true;

        // Check Database
        try (Connection conn = dataSource.getConnection()) {
            details.put("database", Map.of(
                    "status", "UP",
                    "connection", conn.getMetaData().getURL(),
                    "validationQuery", "Connection test successful"
            ));
        } catch (Exception e) {
            isHealthy = false;
            details.put("database", Map.of(
                    "status", "DOWN",
                    "error", e.getMessage()
            ));
        }

        // Check Email Service
        try {
            JavaMailSenderImpl mailSenderImpl = (JavaMailSenderImpl) mailSender;
            details.put("emailService", Map.of(
                    "status", "UP",
                    "host", mailSenderImpl.getHost(),
                    "port", mailSenderImpl.getPort()
            ));
        } catch (Exception e) {
            isHealthy = false;
            details.put("emailService", Map.of(
                    "status", "DOWN",
                    "error", e.getMessage()
            ));
        }

        // Add System Info
        details.put("system", Map.of(
                "javaVersion", System.getProperty("java.version"),
                "osName", System.getProperty("os.name"),
                "availableProcessors", Runtime.getRuntime().availableProcessors(),
                "freeMemory", Runtime.getRuntime().freeMemory() / 1024 / 1024 + "MB",
                "maxMemory", Runtime.getRuntime().maxMemory() / 1024 / 1024 + "MB"
        ));

        return isHealthy ?
                Health.up().withDetails(details).build() :
                Health.down().withDetails(details).build();
    }
}