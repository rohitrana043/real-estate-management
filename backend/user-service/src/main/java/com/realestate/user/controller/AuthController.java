package com.realestate.user.controller;

import com.realestate.user.dto.LoginDTO;
import com.realestate.user.dto.LoginResponseDTO;
import com.realestate.user.dto.RegisterDTO;
import com.realestate.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
        registerDTO.setRole("ROLE_CLIENT");
        return ResponseEntity.ok(authService.register(registerDTO));
    }

    // Admin/Agent registration (secured)
    @PostMapping("/register/secure")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerSecure(@RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(authService.register(registerDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(authService.login(loginDTO));
    }
}