package com.gymmanagement.service;

import com.gymmanagement.dto.LoginRequest;
import com.gymmanagement.dto.LoginResponse;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public LoginResponse login(LoginRequest loginRequest) {
        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        
        // Verify password (in a real app, you would use passwordEncoder.matches())
        // For simplicity, we'll directly compare passwords
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        
        // Generate a simple token (in production, use JWT)
        String token = UUID.randomUUID().toString();
        
        // Determine redirect URL based on role
        String redirectUrl = switch (user.getRole()) {
            case "ADMIN" -> "/admin";
            case "MEMBER" -> "/member";
            case "TRAINER" -> "/trainer";
            default -> "/";
        };
        
        // Build and return response
        return LoginResponse.builder()
                .token(token)
                .role(user.getRole())
                .name(user.getName())
                .redirectUrl(redirectUrl)
                .build();
    }
} 