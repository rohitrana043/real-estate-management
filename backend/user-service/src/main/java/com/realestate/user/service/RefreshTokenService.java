package com.realestate.user.service;

import com.realestate.user.model.RefreshToken;
import com.realestate.user.model.User;
import com.realestate.user.repository.RefreshTokenRepository;
import com.realestate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete existing refresh token if any
//        refreshTokenRepository.deleteByUserId(user.getId());

        // Check if user already has a refresh token
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUserId(user.getId());

        if (existingToken.isPresent()) {
            RefreshToken token = existingToken.get();
            // If token is still valid, return it
            if (token.getExpiryDate().isAfter(Instant.now())) {
                return token;
            }
            // If token expired, delete it
            refreshTokenRepository.deleteById(token.getId());
        }

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired");
        }
        return token;
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
}