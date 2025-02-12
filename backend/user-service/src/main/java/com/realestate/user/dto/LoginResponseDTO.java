package com.realestate.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String token;
    private String refreshToken;
    private UserDTO user;
}