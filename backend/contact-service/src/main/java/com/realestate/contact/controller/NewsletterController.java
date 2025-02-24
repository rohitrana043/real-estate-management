package com.realestate.contact.controller;

import com.realestate.contact.dto.NewsletterRequest;
import com.realestate.contact.dto.NewsletterResponse;
import com.realestate.contact.service.NewsletterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@Tag(name = "Newsletter Management", description = "APIs for managing newsletter subscriptions")
public class NewsletterController {

    private final NewsletterService newsletterService;

    @Autowired
    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @Operation(
            summary = "Subscribe to newsletter",
            description = "Subscribes a user to the newsletter and sends a welcome email"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully subscribed to newsletter",
                    content = @Content(schema = @Schema(implementation = NewsletterResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid email format"),
            @ApiResponse(responseCode = "409", description = "Email already subscribed")
    })
    @PostMapping("/subscribe")
    public ResponseEntity<NewsletterResponse> subscribe(@Valid @RequestBody NewsletterRequest request) {
        NewsletterResponse response = newsletterService.subscribe(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Unsubscribe from newsletter",
            description = "Unsubscribes a user from the newsletter using their unique token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully unsubscribed from newsletter",
                    content = @Content(schema = @Schema(implementation = NewsletterResponse.class))),
            @ApiResponse(responseCode = "404", description = "Invalid unsubscribe token")
    })
    @PostMapping("/unsubscribe")
    public ResponseEntity<NewsletterResponse> unsubscribe(@RequestParam String token) {
        NewsletterResponse response = newsletterService.unsubscribe(token);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Verify unsubscribe token",
            description = "Verifies if an unsubscribe token is valid and returns the associated email"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token verified successfully",
                    content = @Content(schema = @Schema(implementation = NewsletterResponse.class))),
            @ApiResponse(responseCode = "404", description = "Invalid token")
    })
    @GetMapping("/verify")
    public ResponseEntity<NewsletterResponse> verifyUnsubscribeToken(@RequestParam String token) {
        NewsletterResponse response = newsletterService.verifyUnsubscribeToken(token);
        return ResponseEntity.ok(response);
    }
}