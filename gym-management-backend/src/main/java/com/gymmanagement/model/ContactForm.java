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
@Table(name = "contact_forms")
public class ContactForm {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;
    
    @Column
    private String subject;
    
    @Column(columnDefinition = "text")
    private String message;
    
    @Column(name = "is_read", columnDefinition = "tinyint(1) default 0")
    private Boolean isRead = false;
    
    @Column(name = "date_created")
    private LocalDateTime dateCreated;
    
    @PrePersist
    public void prePersist() {
        if (dateCreated == null) {
            dateCreated = LocalDateTime.now();
        }
    }
} 