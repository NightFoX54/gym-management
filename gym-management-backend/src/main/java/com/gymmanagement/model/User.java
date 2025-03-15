package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    
    @Column(name = "profile_photo_path")
    private String profilePhotoPath;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(nullable = false)
    private String role;
    
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;
    
    @Column(nullable = false)
    private String password;
    
    @Transient
    public String getName() {
        return firstName + " " + lastName;
    }
} 