package com.realestate.contact.service;

import com.realestate.contact.model.Contact;
import com.realestate.contact.model.Newsletter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendContactConfirmation(Contact contact) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(contact.getEmail());
            message.setSubject("We've Received Your Message - Real Estate");
            message.setText(createContactConfirmationText(contact));

            mailSender.send(message);
            log.info("Contact confirmation email sent to: {}", contact.getEmail());
        } catch (Exception e) {
            log.error("Failed to send contact confirmation email to: {}", contact.getEmail(), e);
        }
    }

    @Async
    public void sendNewsletterWelcome(Newsletter newsletter) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(newsletter.getEmail());
            message.setSubject("Welcome to Our Newsletter - Real Estate");
            message.setText(createNewsletterWelcomeText(newsletter));

            mailSender.send(message);
            log.info("Newsletter welcome email sent to: {}", newsletter.getEmail());
        } catch (Exception e) {
            log.error("Failed to send newsletter welcome email to: {}", newsletter.getEmail(), e);
        }
    }

    private String createContactConfirmationText(Contact contact) {
        return String.format("""
            Dear %s,
            
            Thank you for contacting us. We have received your message and will get back to you within 24 hours.
            
            Your message details:
            Subject: %s
            Inquiry Type: %s
            
            Best regards,
            Real Estate Team
            """,
                contact.getName(),
                contact.getSubject(),
                contact.getInquiryType() != null ? contact.getInquiryType().toString() : "General"
        );
    }

    private String createNewsletterWelcomeText(Newsletter newsletter) {
        return String.format("""
            Welcome to our Real Estate Newsletter!
            
            Thank you for subscribing to our newsletter. You'll now receive:
            - Latest property listings
            - Market insights and trends
            - Investment opportunities
            - Real estate tips and advice
            
            To manage your subscription or unsubscribe, visit:
            %s/newsletter/manage?token=%s
            
            Best regards,
            Real Estate Team
            """,
                frontendUrl,
                newsletter.getUnsubscribeToken()
        );
    }
}