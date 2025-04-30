package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "friends")
public class Friends {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;
    
    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;
} 