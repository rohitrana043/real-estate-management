package com.realestate.contact.service;

import com.realestate.contact.model.Contact;
import com.realestate.contact.model.Newsletter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 5000; // 5 seconds

    @Async
    public void sendContactConfirmation(Contact contact) {
        Context context = new Context();
        context.setVariable("name", contact.getName());
        context.setVariable("subject", contact.getSubject());
        context.setVariable("inquiryType", contact.getInquiryType() != null ?
                contact.getInquiryType().toString() : "General");
        context.setVariable("message", contact.getMessage());

        String content = templateEngine.process("contact-confirmation", context);
        sendHtmlEmailWithRetry(contact.getEmail(), "We've Received Your Message - Real Estate", content);
    }

    @Async
    public void sendNewsletterWelcome(Newsletter newsletter) {
        Context context = new Context();
        context.setVariable("unsubscribeUrl",
                frontendUrl + "/newsletter/manage?token=" + newsletter.getUnsubscribeToken());

        String content = templateEngine.process("newsletter-welcome", context);
        sendHtmlEmailWithRetry(newsletter.getEmail(), "Welcome to Our Newsletter - Real Estate", content);
    }

    private void sendHtmlEmailWithRetry(String to, String subject, String htmlContent) {
        int attempts = 0;
        boolean sent = false;

        while (!sent && attempts < MAX_RETRIES) {
            attempts++;
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("Email sent successfully to: {} (attempt {})", to, attempts);
                sent = true;
            } catch (MessagingException e) {
                if (attempts < MAX_RETRIES) {
                    log.warn("Failed to send email to: {} (attempt {}). Retrying in {} ms",
                            to, attempts, RETRY_DELAY_MS, e);
                    try {
                        TimeUnit.MILLISECONDS.sleep(RETRY_DELAY_MS);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                } else {
                    log.error("Failed to send email to: {} after {} attempts", to, attempts, e);
                    // For production, you might want to add this to a "failed emails" queue for later retry
                    throw new RuntimeException("Failed to send email after " + MAX_RETRIES + " attempts", e);
                }
            }
        }
    }
}