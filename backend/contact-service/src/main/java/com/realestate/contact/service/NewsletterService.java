package com.realestate.contact.service;

import com.realestate.contact.dto.NewsletterRequest;
import com.realestate.contact.dto.NewsletterResponse;
import com.realestate.contact.exception.DuplicateResourceException;
import com.realestate.contact.exception.ResourceNotFoundException;
import com.realestate.contact.model.Newsletter;
import com.realestate.contact.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NewsletterService {
    private final NewsletterRepository newsletterRepository;
    private final EmailService emailService;

    @Transactional
    public NewsletterResponse subscribe(NewsletterRequest request) {
        log.info("Processing newsletter subscription for email: {}", request.getEmail());
        String email = request.getEmail().toLowerCase();

        // Check if already subscribed
        return newsletterRepository.findByEmail(email)
                .map(existing -> handleExistingSubscriber(existing))
                .orElseGet(() -> createNewSubscription(email));
    }

    @Transactional
    public NewsletterResponse unsubscribe(String token) {
        log.info("Processing newsletter unsubscribe request with token");
        Newsletter newsletter = newsletterRepository.findByUnsubscribeToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid unsubscribe token"));

        if (!newsletter.isActive()) {
            return NewsletterResponse.builder()
                    .success(false)
                    .message("Email is already unsubscribed")
                    .email(newsletter.getEmail())
                    .build();
        }

        newsletter.setActive(false);
        newsletterRepository.save(newsletter);

        log.info("Successfully unsubscribed email: {}", newsletter.getEmail());
        return NewsletterResponse.builder()
                .success(true)
                .message("Successfully unsubscribed from newsletter")
                .email(newsletter.getEmail())
                .build();
    }

    @Transactional(readOnly = true)
    public NewsletterResponse verifyUnsubscribeToken(String token) {
        log.debug("Verifying unsubscribe token");
        Newsletter newsletter = newsletterRepository.findByUnsubscribeToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid unsubscribe token"));

        return NewsletterResponse.builder()
                .success(true)
                .email(newsletter.getEmail())
                .unsubscribeToken(token)
                .build();
    }

    private NewsletterResponse handleExistingSubscriber(Newsletter existing) {
        if (existing.isActive()) {
            throw new DuplicateResourceException("Email is already subscribed");
        }

        // Reactivate subscription
        existing.setActive(true);
        newsletterRepository.save(existing);
        emailService.sendNewsletterWelcome(existing);

        log.info("Reactivated subscription for email: {}", existing.getEmail());
        return NewsletterResponse.builder()
                .success(true)
                .message("Welcome back! Your subscription has been reactivated.")
                .email(existing.getEmail())
                .unsubscribeToken(existing.getUnsubscribeToken())
                .build();
    }

    private NewsletterResponse createNewSubscription(String email) {
        Newsletter newsletter = new Newsletter();
        newsletter.setEmail(email);
        newsletter = newsletterRepository.save(newsletter);

        // Send welcome email asynchronously
        emailService.sendNewsletterWelcome(newsletter);

        log.info("Created new subscription for email: {}", email);
        return NewsletterResponse.builder()
                .success(true)
                .message("Successfully subscribed to newsletter")
                .email(email)
                .unsubscribeToken(newsletter.getUnsubscribeToken())
                .build();
    }
}