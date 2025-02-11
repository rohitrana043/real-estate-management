package com.realestate.property.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PropertyDTO {
    private Long id;
    private String title;
    private String description;
    private String type;
    private String status;
    private BigDecimal price;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;
    private String address;
    private String city;
    private String state;
    private String zipCode;
}