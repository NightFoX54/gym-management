package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trainer_settings")
public class TrainerSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;
    
    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "specialization", columnDefinition = "TEXT")
    private String specialization;
    
    @Column(name = "new_client_notifications", nullable = false)
    private Boolean newClientNotifications = true;
    
    @Column(name = "progress_update_notifications", nullable = false)
    private Boolean progressUpdateNotifications = true;
    
    @Column(name = "mobile_notifications", nullable = false)
    private Boolean mobileNotifications = true;
    
    @Column(name = "desktop_notifications", nullable = false)
    private Boolean desktopNotifications = true;
}
