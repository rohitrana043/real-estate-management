package com.realestate.user.controller;

import com.realestate.user.dto.LoginDTO;
import com.realestate.user.dto.LoginResponseDTO;
import com.realestate.user.dto.RegisterDTO;
import com.realestate.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
        logger.info("Received registration request for user: {}", registerDTO.getEmail());
        logger.debug("Registration details: {}", registerDTO);
        registerDTO.setRole("ROLE_CLIENT");
        String result = authService.register(registerDTO);
        logger.info("Registration completed for user: {}", registerDTO.getEmail());
        return ResponseEntity.ok(result);
//        return ResponseEntity.ok(authService.register(registerDTO));
    }

    // Admin/Agent registration (secured)
    @PostMapping("/register/secure")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerSecure(@RequestBody RegisterDTO registerDTO) {
        logger.info("Received secure registration request for user: {}", registerDTO.getEmail());
        logger.debug("Secure registration details: {}", registerDTO);
        String result = authService.register(registerDTO);
        logger.info("Secure registration completed for user: {}", registerDTO.getEmail());
        return ResponseEntity.ok(result);
//        return ResponseEntity.ok(authService.register(registerDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        logger.info("Received login request for user: {}", loginDTO.getEmail());
        LoginResponseDTO response = authService.login(loginDTO);

        logger.info("Login successful for user: {}", loginDTO.getEmail());
        return ResponseEntity.ok(response);
//        return ResponseEntity.ok(authService.login(loginDTO));
    }
}