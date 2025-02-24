package com.realestate.user.controller;

import com.realestate.user.dto.LoginDTO;
import com.realestate.user.dto.LoginResponseDTO;
import com.realestate.user.dto.RegisterDTO;
import com.realestate.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    @Operation(
            summary = "Register a new client user",
            description = "Creates a new user account with ROLE_CLIENT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User successfully registered",
                    content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "User already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {
        logger.info("Received registration request for user: {}", registerDTO.getEmail());
        registerDTO.setRole("ROLE_CLIENT");
        logger.debug("Registration details: {}", registerDTO);
        String result = authService.register(registerDTO);
        logger.info("Registration completed for user: {}", registerDTO.getEmail());
        return ResponseEntity.ok(result);
//        return ResponseEntity.ok(authService.register(registerDTO));
    }

    // Admin/Agent registration (secured)
    @Operation(
            summary = "Register a new admin/agent user",
            description = "Creates a new admin or agent user account (requires ADMIN role)",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - requires ADMIN role"),
            @ApiResponse(responseCode = "409", description = "User already exists")
    })
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

    @Operation(
            summary = "User login",
            description = "Authenticates a user and returns JWT tokens"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully authenticated",
                    content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        logger.info("Received login request for user: {}", loginDTO.getEmail());
        LoginResponseDTO response = authService.login(loginDTO);

        logger.info("Login successful for user: {}", loginDTO.getEmail());
        return ResponseEntity.ok(response);
//        return ResponseEntity.ok(authService.login(loginDTO));
    }
}