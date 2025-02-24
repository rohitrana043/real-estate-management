package com.realestate.contact.dto;

import com.realestate.contact.model.InquiryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private InquiryType inquiryType;
    private boolean responded;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}