package com.realestate.user.dto;

import com.realestate.user.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @ValidPassword
    private String password;

    @Pattern(regexp = "^\\+?[1-9][0-9]{7,14}$", message = "Invalid phone number")
    private String phone;

    private String address;

    private String role;
}