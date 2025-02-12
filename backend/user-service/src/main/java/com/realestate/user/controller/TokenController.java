package com.realestate.user.controller;

import com.realestate.user.dto.RefreshTokenRequest;
import com.realestate.user.dto.TokenRefreshResponse;
import com.realestate.user.model.RefreshToken;
import com.realestate.user.config.JwtConfig;
import com.realestate.user.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/token")
@RequiredArgsConstructor
public class TokenController {
    private final RefreshTokenService refreshTokenService;
    private final JwtConfig jwtConfig;

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.verifyExpiration(
                refreshTokenService.findByToken(request.getRefreshToken())
                        .orElseThrow(() -> new RuntimeException("Refresh token not found"))
        );

        String token = jwtConfig.generateToken(refreshToken.getUser().getEmail());

        return ResponseEntity.ok(new TokenRefreshResponse(token, request.getRefreshToken()));
    }

    @PostMapping("/revoke")
    public ResponseEntity<String> revokeToken(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.deleteByToken(request.getRefreshToken());
        return ResponseEntity.ok("Refresh token revoked");
    }
}