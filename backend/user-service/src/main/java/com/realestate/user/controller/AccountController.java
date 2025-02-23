package com.realestate.user.controller;

import com.realestate.user.dto.PasswordResetRequest;
import com.realestate.user.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "APIs for managing account verification and password reset")
public class AccountController {
    private final AccountService accountService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Operation(
            summary = "Verify email address",
            description = "Verifies a user's email address using the verification token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(accountService.verifyEmail(token));
//        accountService.verifyEmail(token);
//        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(frontendUrl + "/verification-success")).build();
    }

    @Operation(
            summary = "Initiate password reset",
            description = "Sends a password reset email to the specified email address"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset email sent"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/password/forgot")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        accountService.initiatePasswordReset(email);
        return ResponseEntity.ok("Password reset email sent");
    }

    @Operation(
            summary = "Reset password",
            description = "Resets the user's password using the reset token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token"),
            @ApiResponse(responseCode = "400", description = "Invalid password format")
    })
    @PostMapping("/password/reset")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(accountService.resetPassword(request));
    }

    @Operation(
            summary = "Resend verification email",
            description = "Resends the email verification link to the user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Verification email resent"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam String email) {
        accountService.resendVerificationEmail(email);
        return ResponseEntity.ok("Verification email resent");
    }
}