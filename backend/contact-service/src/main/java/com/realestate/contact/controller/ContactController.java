// src/main/java/com/realestate/contact/controller/ContactController.java
package com.realestate.contact.controller;

import com.realestate.contact.dto.ApiResponse;
import com.realestate.contact.dto.ContactRequest;
import com.realestate.contact.dto.ContactResponse;
import com.realestate.contact.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    @Autowired
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping({"", "/"})
    public ResponseEntity<ContactResponse> submitContactForm(@Valid @RequestBody ContactRequest request) {
        try {
            ContactResponse response = contactService.submitContactForm(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Long id) {
        ContactResponse response = contactService.getContactById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"", "/"})
    public ResponseEntity<Page<ContactResponse>> getAllContacts(Pageable pageable) {
        Page<ContactResponse> contacts = contactService.getAllContacts(pageable);
        return ResponseEntity.ok(contacts);
    }

    @PatchMapping("/{id}/respond")
    public ResponseEntity<ContactResponse> markAsResponded(@PathVariable Long id) {
        ContactResponse response = contactService.markAsResponded(id);
        return ResponseEntity.ok(response);
    }
}