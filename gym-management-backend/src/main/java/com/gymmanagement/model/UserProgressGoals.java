package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_progress_goals")
public class UserProgressGoals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "set_by", nullable = false)
    private Long setBy;

    @Column(name = "goal_date", nullable = false)
    private LocalDate goalDate;

    @Column(name = "target_weight")
    private Double targetWeight;

    @Column(name = "target_body_fat")
    private Double targetBodyFat;

    @Column(name = "notes")
    private String notes;
}
