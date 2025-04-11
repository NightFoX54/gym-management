package com.gymmanagement.controller;

import com.gymmanagement.dto.LoginRequest;
import com.gymmanagement.dto.LoginResponse;
import com.gymmanagement.dto.SignupRequest;
import com.gymmanagement.dto.SignupResponse;
import com.gymmanagement.service.AuthService;
import com.gymmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> registerUser(@RequestBody SignupRequest signupRequest) {
        SignupResponse response = userService.registerUser(signupRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Validates if email or phone number already exists in the database
     */
    @PostMapping("/validate-credentials")
    public ResponseEntity<Map<String, Boolean>> validateCredentials(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String phoneNumber = credentials.get("phoneNumber");
        
        Map<String, Boolean> response = new HashMap<>();
        
        // Check if email exists
        boolean emailExists = email != null && !email.isEmpty() && 
                              userService.existsByEmail(email);
        response.put("emailExists", emailExists);
        
        // Check if phone number exists
        boolean phoneExists = phoneNumber != null && !phoneNumber.isEmpty() && 
                              userService.existsByPhoneNumber(phoneNumber);
        response.put("phoneExists", phoneExists);
        
        return ResponseEntity.ok(response);
    }
} 