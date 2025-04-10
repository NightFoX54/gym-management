package com.gymmanagement.controller;

import com.gymmanagement.model.ContactForm;
import com.gymmanagement.repository.ContactFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH})
public class ContactFormController {

    @Autowired
    private ContactFormRepository contactFormRepository;
    
    @GetMapping("/all")
    public ResponseEntity<List<ContactForm>> getAllMessages(
            @RequestParam(defaultValue = "desc") String sort) {
        try {
            List<ContactForm> messages;
            if (sort.equals("asc")) {
                messages = contactFormRepository.findAllByOrderByDateCreatedAsc();
            } else {
                messages = contactFormRepository.findAllByOrderByDateCreatedDesc();
            }
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<ContactForm>> getUnreadMessages(
            @RequestParam(defaultValue = "desc") String sort) {
        try {
            List<ContactForm> messages;
            if (sort.equals("asc")) {
                messages = contactFormRepository.findByIsReadOrderByDateCreatedAsc(false);
            } else {
                messages = contactFormRepository.findByIsReadOrderByDateCreatedDesc(false);
            }
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/read")
    public ResponseEntity<List<ContactForm>> getReadMessages(
            @RequestParam(defaultValue = "desc") String sort) {
        try {
            List<ContactForm> messages;
            if (sort.equals("asc")) {
                messages = contactFormRepository.findByIsReadOrderByDateCreatedAsc(true);
            } else {
                messages = contactFormRepository.findByIsReadOrderByDateCreatedDesc(true);
            }
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactForm contactForm) {
        try {
            ContactForm savedForm = contactFormRepository.save(contactForm);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contact form submitted successfully");
            response.put("id", savedForm.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {
        try {
            ContactForm form = contactFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact form not found with id: " + id));
            
            form.setIsRead(true);
            contactFormRepository.save(form);
            
            return ResponseEntity.ok(Collections.singletonMap("message", "Contact form marked as read"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
} 