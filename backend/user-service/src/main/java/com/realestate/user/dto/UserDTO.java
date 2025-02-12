package com.realestate.user.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String profilePicture;
    private boolean enabled;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}