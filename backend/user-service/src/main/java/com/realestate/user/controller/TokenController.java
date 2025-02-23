package com.realestate.user.controller;

import com.realestate.user.dto.RefreshTokenRequest;
import com.realestate.user.dto.TokenRefreshResponse;
import com.realestate.user.model.RefreshToken;
import com.realestate.user.config.JwtConfig;
import com.realestate.user.service.RefreshTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/token")
@RequiredArgsConstructor
@Tag(name = "Token Management", description = "APIs for managing JWT refresh tokens")
public class TokenController {
    private final RefreshTokenService refreshTokenService;
    private final JwtConfig jwtConfig;

    @Operation(
            summary = "Refresh access token",
            description = "Creates a new access token using a valid refresh token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid refresh token"),
            @ApiResponse(responseCode = "401", description = "Refresh token expired")
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.verifyExpiration(
                refreshTokenService.findByToken(request.getRefreshToken())
                        .orElseThrow(() -> new RuntimeException("Refresh token not found"))
        );

        String token = jwtConfig.generateToken(refreshToken.getUser().getEmail());

        return ResponseEntity.ok(new TokenRefreshResponse(token, request.getRefreshToken()));
    }

    @Operation(
            summary = "Revoke refresh token",
            description = "Invalidates a refresh token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token revoked successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid refresh token")
    })
    @PostMapping("/revoke")
    public ResponseEntity<String> revokeToken(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.deleteByToken(request.getRefreshToken());
        return ResponseEntity.ok("Refresh token revoked");
    }
}