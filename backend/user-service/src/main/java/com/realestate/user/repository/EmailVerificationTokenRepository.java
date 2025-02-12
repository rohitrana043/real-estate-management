package com.realestate.user.repository;

import com.realestate.user.model.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
    Optional<EmailVerificationToken> findByUserEmail(String email);
}