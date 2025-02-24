package com.realestate.contact.controller;

import com.realestate.contact.dto.ContactRequest;
import com.realestate.contact.dto.ContactResponse;
import com.realestate.contact.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@Slf4j
@Tag(name = "Contact Management", description = "APIs for managing contact form submissions")
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @Operation(
            summary = "Submit a contact form",
            description = "Submits a new contact form and sends an email confirmation to the user"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Contact form submitted successfully",
                    content = @Content(schema = @Schema(implementation = ContactResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<ContactResponse> submitContactForm(@Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.submitContactForm(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Get contact by ID",
            description = "Retrieves a specific contact form submission by its ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact found successfully"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Long id) {
        ContactResponse response = contactService.getContactById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get all contacts",
            description = "Retrieves all contact form submissions with pagination"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contacts retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<Page<ContactResponse>> getAllContacts(Pageable pageable) {
        Page<ContactResponse> contacts = contactService.getAllContacts(pageable);
        return ResponseEntity.ok(contacts);
    }

    @Operation(
            summary = "Mark contact as responded",
            description = "Updates a contact's status to indicate that it has been responded to"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contact marked as responded successfully"),
            @ApiResponse(responseCode = "404", description = "Contact not found")
    })
    @PatchMapping("/{id}/respond")
    public ResponseEntity<ContactResponse> markAsResponded(@PathVariable Long id) {
        ContactResponse response = contactService.markAsResponded(id);
        return ResponseEntity.ok(response);
    }
}