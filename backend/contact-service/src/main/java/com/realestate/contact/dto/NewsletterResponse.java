package com.realestate.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterResponse {
    private boolean success;
    private String message;
    private String email;
    private String unsubscribeToken;
}