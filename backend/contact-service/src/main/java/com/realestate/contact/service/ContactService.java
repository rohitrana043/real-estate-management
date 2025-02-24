// src/main/java/com/realestate/contact/service/ContactService.java
package com.realestate.contact.service;

import com.realestate.contact.dto.ContactRequest;
import com.realestate.contact.dto.ContactResponse;
import com.realestate.contact.exception.ResourceNotFoundException;
import com.realestate.contact.model.Contact;
import com.realestate.contact.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final EmailService emailService;

    @Transactional
    public ContactResponse submitContactForm(ContactRequest request) {
        log.info("Processing contact form submission for email: {}", request.getEmail());

        Contact contact = Contact.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .inquiryType(request.getInquiryType())
                .build();

        contact = contactRepository.save(contact);

        // Send confirmation email asynchronously
        emailService.sendContactConfirmation(contact);

        log.info("Contact form submitted successfully with ID: {}", contact.getId());
        return mapToResponse(contact);
    }

    @Transactional(readOnly = true)
    public ContactResponse getContactById(Long id) {
        log.debug("Fetching contact with ID: {}", id);
        return contactRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<ContactResponse> getAllContacts(Pageable pageable) {
        log.debug("Fetching contacts page: {}", pageable);
        return contactRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public ContactResponse markAsResponded(Long id) {
        log.info("Marking contact {} as responded", id);
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        contact.setResponded(true);
        contact = contactRepository.save(contact);

        return mapToResponse(contact);
    }

    private ContactResponse mapToResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .inquiryType(contact.getInquiryType())
                .responded(contact.isResponded())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}