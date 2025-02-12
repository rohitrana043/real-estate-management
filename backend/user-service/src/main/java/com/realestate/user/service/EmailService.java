package com.realestate.user.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.verification-url}")
    private String verificationBaseUrl;

    @Value("${app.email.password-reset-url}")
    private String passwordResetBaseUrl;

    public void sendVerificationEmail(String to, String token, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("verificationUrl", verificationBaseUrl + "?token=" + token);

        String content = templateEngine.process("verification-email", context);
        sendHtmlEmail(to, "Email Verification", content);
    }

    public void sendPasswordResetEmail(String to, String token, String name) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("resetUrl", passwordResetBaseUrl + "?token=" + token);

        String content = templateEngine.process("reset-password-email", context);
        sendHtmlEmail(to, "Password Reset Request", content);
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
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}