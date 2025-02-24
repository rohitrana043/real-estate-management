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

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendContactConfirmation(Contact contact) {
        Context context = new Context();
        context.setVariable("name", contact.getName());
        context.setVariable("subject", contact.getSubject());
        context.setVariable("inquiryType", contact.getInquiryType() != null ?
                contact.getInquiryType().toString() : "General");
        context.setVariable("message", contact.getMessage());

        String content = templateEngine.process("contact-confirmation", context);
        sendHtmlEmail(contact.getEmail(), "We've Received Your Message - Real Estate", content);
    }

    @Async
    public void sendNewsletterWelcome(Newsletter newsletter) {
        Context context = new Context();
        context.setVariable("unsubscribeUrl",
                frontendUrl + "/newsletter/manage?token=" + newsletter.getUnsubscribeToken());

        String content = templateEngine.process("newsletter-welcome", context);
        sendHtmlEmail(newsletter.getEmail(), "Welcome to Our Newsletter - Real Estate", content);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}