package com.realestate.user.service;

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

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.verification-url}")
    private String verificationBaseUrl;

    @Value("${app.email.password-reset-url}")
    private String passwordResetBaseUrl;

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 5000; // 5 seconds

    @Async
    public void sendVerificationEmail(String to, String token, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("verificationUrl", verificationBaseUrl + "?token=" + token);

        String content = templateEngine.process("verification-email", context);
        sendHtmlEmailWithRetry(to, "Email Verification", content);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("resetUrl", passwordResetBaseUrl + "?token=" + token);

        String content = templateEngine.process("reset-password-email", context);
        sendHtmlEmailWithRetry(to, "Password Reset Request", content);
    }

    @Async
    public void sendAccountDeletionEmail(String to, String userName) {
        Context context = new Context();
        context.setVariable("userName", userName);

        String content = templateEngine.process("account-deletion-email", context);
        sendHtmlEmailWithRetry(to, "Your Account Has Been Deleted", content);
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