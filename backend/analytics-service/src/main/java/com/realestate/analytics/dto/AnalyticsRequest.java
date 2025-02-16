package com.realestate.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AnalyticsRequest {
    @NotBlank(message = "City name cannot be empty")
    @Pattern(regexp = "^[a-zA-Z\\s-]+$", message = "City name can only contain letters, spaces, and hyphens")
    private String city;

    @NotBlank(message = "Property type cannot be empty")
    @Pattern(regexp = "^[a-zA-Z\\s-]+$", message = "Property type can only contain letters, spaces, and hyphens")
    private String propertyType;
}