package com.realestate.user.controller;

import com.realestate.user.dto.PasswordResetRequest;
import com.realestate.user.service.AccountService;
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
public class AccountController {
    private final AccountService accountService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(accountService.verifyEmail(token));
//        accountService.verifyEmail(token);
//        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(frontendUrl + "/verification-success")).build();
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        accountService.initiatePasswordReset(email);
        return ResponseEntity.ok("Password reset email sent");
    }

    @PostMapping("/password/reset")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        return ResponseEntity.ok(accountService.resetPassword(request));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(@RequestParam String email) {
        accountService.resendVerificationEmail(email);
        return ResponseEntity.ok("Verification email resent");
    }
}