package com.realestate.contact.actuator;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class ContactMetrics {
    private final Counter newsletterSubscriptionsCounter;
    private final Counter contactSubmissionsCounter;

    public ContactMetrics(MeterRegistry registry) {
        this.newsletterSubscriptionsCounter = Counter.builder("newsletter.subscriptions")
                .description("Number of newsletter subscriptions")
                .register(registry);

        this.contactSubmissionsCounter = Counter.builder("contact.submissions")
                .description("Number of contact form submissions")
                .register(registry);
    }

    public void incrementNewsletterSubscriptions() {
        this.newsletterSubscriptionsCounter.increment();
    }

    public void incrementContactSubmissions() {
        this.contactSubmissionsCounter.increment();
    }
}