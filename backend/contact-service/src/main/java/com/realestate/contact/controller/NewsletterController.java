// src/main/java/com/realestate/contact/controller/NewsletterController.java
package com.realestate.contact.controller;

import com.realestate.contact.dto.NewsletterRequest;
import com.realestate.contact.dto.NewsletterResponse;
import com.realestate.contact.service.NewsletterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterService newsletterService;

    @Autowired
    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<NewsletterResponse> subscribe(@Valid @RequestBody NewsletterRequest request) {
        NewsletterResponse response = newsletterService.subscribe(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<NewsletterResponse> unsubscribe(@RequestParam String token) {
        NewsletterResponse response = newsletterService.unsubscribe(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<NewsletterResponse> verifyUnsubscribeToken(@RequestParam String token) {
        NewsletterResponse response = newsletterService.verifyUnsubscribeToken(token);
        return ResponseEntity.ok(response);
    }
}