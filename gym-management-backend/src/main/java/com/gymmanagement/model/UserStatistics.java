package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_statistics")
public class UserStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "entered_by", nullable = false)
    private Long enteredBy;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "body_fat")
    private Double bodyFat;

    @Column(name = "height")
    private Double height;

    @Column(name = "notes")
    private String notes;
}
