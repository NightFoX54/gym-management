package com.gymmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerSettingsDTO {
    private Long id;
    private Long trainerId;
    private String bio;
    private String specialization;
    private Boolean newClientNotifications;
    private Boolean progressUpdateNotifications;
    private Boolean mobileNotifications;
    private Boolean desktopNotifications;
}
