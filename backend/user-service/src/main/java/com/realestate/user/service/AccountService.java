package com.realestate.user.service;

import com.realestate.user.dto.PasswordResetRequest;
import com.realestate.user.model.EmailVerificationToken;
import com.realestate.user.model.PasswordResetToken;
import com.realestate.user.model.User;
import com.realestate.user.repository.EmailVerificationTokenRepository;
import com.realestate.user.repository.PasswordResetTokenRepository;
import com.realestate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String verifyEmail(String token) {
        EmailVerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);
        verificationToken.setVerified(true);
        verificationTokenRepository.save(verificationToken);

        return "Email verified successfully";
    }

    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(email, token, user.getName());
    }

    @Transactional
    public String resetPassword(PasswordResetRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

        return "Password reset successfully";
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            throw new RuntimeException("User already verified");
        }

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(email, token, user.getName());
    }
}