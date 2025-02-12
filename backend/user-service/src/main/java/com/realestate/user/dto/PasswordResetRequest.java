package com.realestate.user.dto;

import com.realestate.user.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordResetRequest {
    @NotBlank
    private String token;

    @ValidPassword
    private String newPassword;
}