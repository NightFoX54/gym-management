package com.gymmanagement.service;

import com.gymmanagement.dto.*;
import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainerService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private TrainerSessionRepository trainerSessionRepository;
    
    @Autowired
    private TrainerSettingsRepository trainerSettingsRepository;
    
    @Autowired
    private TrainerRegistrationRequestRepository registrationRequestRepository;
    
    public List<TrainerClientDTO> getTrainerClients(Long trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                
        return trainerClientRepository.findByTrainer(trainer)
                .stream()
                .map(this::convertToTrainerClientDTO)
                .collect(Collectors.toList());
    }
    
    public List<TrainerSessionDTO> getTrainerSessions(Long trainerId, LocalDate startDate, LocalDate endDate) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                
        return trainerSessionRepository.findByTrainerAndSessionDateBetween(trainer, startDate, endDate)
                .stream()
                .map(this::convertToTrainerSessionDTO)
                .collect(Collectors.toList());
    }
    
    public TrainerSettingsDTO getTrainerSettings(Long trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                
        TrainerSettings settings = trainerSettingsRepository.findByTrainer(trainer)
                .orElseGet(() -> createDefaultSettings(trainer));
                
        return convertToTrainerSettingsDTO(settings);
    }
    
    @Transactional
    public TrainerSettingsDTO updateTrainerSettings(Long trainerId, TrainerSettingsDTO settingsDTO) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                
        TrainerSettings settings = trainerSettingsRepository.findByTrainer(trainer)
                .orElseGet(() -> createDefaultSettings(trainer));
                
        settings.setBio(settingsDTO.getBio());
        settings.setSpecialization(settingsDTO.getSpecialization());
        settings.setNewClientNotifications(settingsDTO.getNewClientNotifications());
        settings.setProgressUpdateNotifications(settingsDTO.getProgressUpdateNotifications());
        settings.setMobileNotifications(settingsDTO.getMobileNotifications());
        settings.setDesktopNotifications(settingsDTO.getDesktopNotifications());
        
        TrainerSettings updatedSettings = trainerSettingsRepository.save(settings);
        return convertToTrainerSettingsDTO(updatedSettings);
    }
    
    @Transactional
    public TrainerSessionDTO createSession(Long trainerId, TrainerSessionDTO sessionDTO) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                
        User client = userRepository.findById(sessionDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
                
        // Check if client is assigned to this trainer
        if (!trainerClientRepository.existsByTrainerAndClient(trainer, client)) {
            throw new RuntimeException("Client is not assigned to this trainer");
        }
        
        TrainerSession session = new TrainerSession();
        session.setTrainer(trainer);
        session.setClient(client);
        session.setSessionDate(sessionDTO.getSessionDate());
        session.setSessionTime(sessionDTO.getSessionTime());
        
        TrainerSession savedSession = trainerSessionRepository.save(session);
        
        // Decrement remaining sessions count
        List<TrainerClient> trainerClients = trainerClientRepository.findByTrainer(trainer)
                .stream()
                .filter(tc -> tc.getClient().getId().equals(client.getId()))
                .collect(Collectors.toList());
                
        if (!trainerClients.isEmpty()) {
            TrainerClient trainerClient = trainerClients.get(0);
            if (trainerClient.getRemainingSessions() > 0) {
                trainerClient.setRemainingSessions(trainerClient.getRemainingSessions() - 1);
                trainerClientRepository.save(trainerClient);
            }
        }
        
        return convertToTrainerSessionDTO(savedSession);
    }
    
    @Transactional
    public void deleteSession(Long sessionId) {
        trainerSessionRepository.deleteById(sessionId);
    }
    
    public List<TrainerRegistrationRequestDTO> getRegistrationRequests(Long trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                
        return registrationRequestRepository.findByTrainer(trainer)
                .stream()
                .map(this::convertToRegistrationRequestDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TrainerClientDTO approveRegistrationRequest(Long requestId, Integer sessionCount) {
        TrainerRegistrationRequest request = registrationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Registration request not found"));
                
        TrainerClient trainerClient = new TrainerClient();
        trainerClient.setTrainer(request.getTrainer());
        trainerClient.setClient(request.getClient());
        trainerClient.setRegistrationDate(LocalDateTime.now());
        trainerClient.setRemainingSessions(sessionCount);
        
        TrainerClient savedClient = trainerClientRepository.save(trainerClient);
        
        // Delete the request after approval
        registrationRequestRepository.delete(request);
        
        return convertToTrainerClientDTO(savedClient);
    }
    
    @Transactional
    public void rejectRegistrationRequest(Long requestId) {
        registrationRequestRepository.deleteById(requestId);
    }
    
    private TrainerSettings createDefaultSettings(User trainer) {
        TrainerSettings settings = new TrainerSettings();
        settings.setTrainer(trainer);
        settings.setBio("Professional trainer with years of experience");
        settings.setSpecialization("General fitness");
        settings.setNewClientNotifications(true);
        settings.setProgressUpdateNotifications(true);
        settings.setMobileNotifications(true);
        settings.setDesktopNotifications(true);
        return trainerSettingsRepository.save(settings);
    }
    
    private TrainerClientDTO convertToTrainerClientDTO(TrainerClient client) {
        return TrainerClientDTO.builder()
                .id(client.getId())
                .trainerId(client.getTrainer().getId())
                .trainerName(client.getTrainer().getName())
                .clientId(client.getClient().getId())
                .clientName(client.getClient().getName())
                .clientEmail(client.getClient().getEmail())
                .clientPhone(client.getClient().getPhoneNumber())
                .registrationDate(client.getRegistrationDate())
                .remainingSessions(client.getRemainingSessions())
                .build();
    }
    
    private TrainerSessionDTO convertToTrainerSessionDTO(TrainerSession session) {
        return TrainerSessionDTO.builder()
                .id(session.getId())
                .trainerId(session.getTrainer().getId())
                .trainerName(session.getTrainer().getName())
                .clientId(session.getClient().getId())
                .clientName(session.getClient().getName())
                .sessionDate(session.getSessionDate())
                .sessionTime(session.getSessionTime())
                .build();
    }
    
    private TrainerSettingsDTO convertToTrainerSettingsDTO(TrainerSettings settings) {
        return TrainerSettingsDTO.builder()
                .id(settings.getId())
                .trainerId(settings.getTrainer().getId())
                .bio(settings.getBio())
                .specialization(settings.getSpecialization())
                .newClientNotifications(settings.getNewClientNotifications())
                .progressUpdateNotifications(settings.getProgressUpdateNotifications())
                .mobileNotifications(settings.getMobileNotifications())
                .desktopNotifications(settings.getDesktopNotifications())
                .build();
    }
    
    private TrainerRegistrationRequestDTO convertToRegistrationRequestDTO(TrainerRegistrationRequest request) {
        return TrainerRegistrationRequestDTO.builder()
                .id(request.getId())
                .trainerId(request.getTrainer().getId())
                .trainerName(request.getTrainer().getName())
                .clientId(request.getClient().getId())
                .clientName(request.getClient().getName())
                .clientEmail(request.getClient().getEmail())
                .clientPhone(request.getClient().getPhoneNumber())
                .requestMessage(request.getRequestMessage())
                .requestedMeetingDate(request.getRequestedMeetingDate())
                .requestedMeetingTime(request.getRequestedMeetingTime())
                .isModifiedByTrainer(request.getIsModifiedByTrainer())
                .build();
    }
}
