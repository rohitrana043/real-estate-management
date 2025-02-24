// ChangePasswordDTO.java
package com.realestate.user.dto;

import jakarta.validation.constraints.NotBlank;
import com.realestate.user.validation.ValidPassword;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @ValidPassword
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}