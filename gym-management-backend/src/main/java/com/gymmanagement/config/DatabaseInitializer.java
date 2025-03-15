package com.gymmanagement.config;

import com.gymmanagement.model.User;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Only add test users if the database is empty
        if (userRepository.count() == 0) {
            // Create an admin user
            User admin = new User();
            admin.setEmail("admin@gymflex.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRegistrationDate(LocalDateTime.now());
            userRepository.save(admin);
            
            // Create a member user
            User member = new User();
            member.setEmail("member@gymflex.com");
            member.setPassword(passwordEncoder.encode("member123"));
            member.setRole("MEMBER");
            member.setFirstName("Member");
            member.setLastName("User");
            member.setRegistrationDate(LocalDateTime.now());
            userRepository.save(member);
            
            // Create a trainer user
            User trainer = new User();
            trainer.setEmail("trainer@gymflex.com");
            trainer.setPassword(passwordEncoder.encode("trainer123"));
            trainer.setRole("TRAINER");
            trainer.setFirstName("Trainer");
            trainer.setLastName("User");
            trainer.setRegistrationDate(LocalDateTime.now());
            userRepository.save(trainer);
            
            System.out.println("Test users created successfully!");
        }
    }
} 