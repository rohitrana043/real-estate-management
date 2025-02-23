package com.realestate.property.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Standard error response")
public class ErrorResponse {

    @Schema(description = "Error timestamp", example = "2024-02-17T10:30:45")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "400")
    private int status;

    @Schema(description = "Error message", example = "Invalid input data")
    private String message;

    @Schema(description = "Detailed error description", example = "Property price must be greater than zero")
    private String details;

    @Schema(description = "Path where the error occurred", example = "/api/properties")
    private String path;
}