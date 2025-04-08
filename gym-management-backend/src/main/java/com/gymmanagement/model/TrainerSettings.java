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
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;
    
    @Column(name = "bio", columnDefinition = "TEXT", length = 2000)
    private String bio;
    
    @Column(name = "specialization", columnDefinition = "TEXT", length = 1000)
    private String specialization;
    
    @Column(name = "new_client_notifications")
    private Boolean newClientNotifications = true;
    
    @Column(name = "progress_update_notifications")
    private Boolean progressUpdateNotifications = true;
    
    @Column(name = "mobile_notifications")
    private Boolean mobileNotifications = true;
    
    @Column(name = "desktop_notifications")
    private Boolean desktopNotifications = true;
}
