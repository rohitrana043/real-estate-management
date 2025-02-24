package com.realestate.contact.actuator;

import com.realestate.contact.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NewsletterHealthIndicator implements HealthIndicator {

    private final NewsletterRepository newsletterRepository;

    @Override
    public Health health() {
        try {
            long subscriberCount = newsletterRepository.count();
            return Health.up()
                    .withDetail("subscriberCount", subscriberCount)
                    .withDetail("status", "Newsletter service is operational")
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}