package com.realestate.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String token;
    private String refreshToken;
    private String tokenType;       // Always "Bearer"
    private UserDTO user;

    // Constructor with default tokenType
    public LoginResponseDTO(String token, String refreshToken, UserDTO user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
        this.tokenType = "Bearer";
    }

    // All-args constructor
    public LoginResponseDTO(String token, String refreshToken, String tokenType, UserDTO user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.user = user;
    }
}