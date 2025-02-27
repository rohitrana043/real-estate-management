package com.realestate.property.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PropertyDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 1000, message = "Description must be between 20 and 1000 characters")
    private String description;

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "^(APARTMENT|HOUSE|COMMERCIAL|CONDO)$", message = "Invalid property type")
    private String type;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(AVAILABLE|SOLD|RENTED)$", message = "Invalid property status")
    private String status;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "Number of bedrooms cannot be negative")
    private Integer bedrooms;

    @Min(value = 0, message = "Number of bathrooms cannot be negative")
    private Integer bathrooms;

    @NotNull(message = "Area is required")
    @DecimalMin(value = "0.0", message = "Area must be greater than 0")
    private Double area;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @Pattern(regexp = "^\\d{5}(-\\d{4})?$|^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$|^\\d{6}$", message = "Invalid ZIP code format")
    private String zipCode;

    private List<ImageDTO> images;

    private boolean favorite;
    private long favoriteCount;
}