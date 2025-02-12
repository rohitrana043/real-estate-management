package com.realestate.user.repository;

import com.realestate.user.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByToken(String token);
    void deleteByUserId(Long userId); // Add this method
    Optional<RefreshToken> findByUserId(Long userId); // Optional: if you want to check existing tokens
}