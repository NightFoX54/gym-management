package com.gymmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.dto.PasswordResetRequest;
import com.gymmanagement.dto.PasswordUpdateRequest;
import com.gymmanagement.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PasswordController {

    @Autowired
    private UserService userService;
    
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean result = userService.requestPasswordReset(email);
        
        Map<String, Object> response = new HashMap<>();
        // Always return success to prevent email enumeration attacks
        response.put("success", true);
        response.put("message", "If the email exists in our system, a password reset link has been sent.");
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordUpdateRequest request) {
        boolean result = userService.resetPassword(request.getToken(), request.getNewPassword());
        
        Map<String, Object> response = new HashMap<>();
        if (result) {
            response.put("success", true);
            response.put("message", "Password has been updated successfully.");
        } else {
            response.put("success", false);
            response.put("message", "Invalid or expired token.");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        boolean isValid = userService.validateResetToken(token);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        
        return ResponseEntity.ok(response);
    }
} 