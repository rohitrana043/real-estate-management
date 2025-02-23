package com.realestate.user.service;

import com.realestate.user.config.JwtConfig;
import com.realestate.user.dto.LoginDTO;
import com.realestate.user.dto.LoginResponseDTO;
import com.realestate.user.dto.RegisterDTO;
import com.realestate.user.dto.UserDTO;
import com.realestate.user.model.EmailVerificationToken;
import com.realestate.user.model.RefreshToken;
import com.realestate.user.model.Role;
import com.realestate.user.model.User;
import com.realestate.user.repository.EmailVerificationTokenRepository;
import com.realestate.user.repository.RoleRepository;
import com.realestate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;
    private final EmailVerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;

    @Override
    public LoginResponseDTO login(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        // Get the username (email) from the authenticated user
        String username = authentication.getName();

        // Generate the JWT token using the username
        String jwt = jwtConfig.generateToken(username);

        // Generate refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(username);

        // Get user details directly from repository instead of userService
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user details
        UserDTO userDTO = userService.convertToDTO(user);

        // Create and return response
        return LoginResponseDTO.builder()
                .token(jwt)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .user(userDTO)
                .build();
    }

    @Override
    @Transactional
    public String register(RegisterDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(registerDTO.getName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setPhone(registerDTO.getPhone());
        user.setAddress(registerDTO.getAddress());
        user.setEnabled(false); // User starts as disabled until email verification

        Set<Role> roles = new HashSet<>();
        // Determine the role
        String roleName = (registerDTO.getRole() != null)
                ? registerDTO.getRole().toUpperCase()
                : "ROLE_CLIENT";

        // Validate role name
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName.toUpperCase();
        }
        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        // Create and send verification token
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token, user.getName());

        return "Registration successful. Please check your email for verification.";
    }
}