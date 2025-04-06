package com.gymmanagement.model;

// For Spring Boot 2.x
// import javax.persistence.*;

// For Spring Boot 3.x
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member_training_plans")
@Data
@NoArgsConstructor
public class MemberTrainingPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;
    
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek; // 1-7 representing Monday-Sunday
} 