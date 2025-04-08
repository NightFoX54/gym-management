package com.gymmanagement.controller;

import com.gymmanagement.dto.TrainerClientDTO;
import com.gymmanagement.dto.TrainerRegistrationRequestDTO;
import com.gymmanagement.dto.TrainerSessionDTO;
import com.gymmanagement.dto.TrainerSettingsDTO;
import com.gymmanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your React app
public class TrainerController {

    @Autowired
    private TrainerService trainerService;
    
    @GetMapping("/{trainerId}/clients")
    public ResponseEntity<List<TrainerClientDTO>> getTrainerClients(@PathVariable Long trainerId) {
        List<TrainerClientDTO> clients = trainerService.getTrainerClients(trainerId);
        return ResponseEntity.ok(clients);
    }
    
    @GetMapping("/{trainerId}/sessions")
    public ResponseEntity<List<TrainerSessionDTO>> getTrainerSessions(
            @PathVariable Long trainerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<TrainerSessionDTO> sessions = trainerService.getTrainerSessions(trainerId, startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
    
    @PostMapping("/{trainerId}/sessions")
    public ResponseEntity<TrainerSessionDTO> createSession(
            @PathVariable Long trainerId,
            @RequestBody TrainerSessionDTO sessionDTO) {
        
        TrainerSessionDTO createdSession = trainerService.createSession(trainerId, sessionDTO);
        return ResponseEntity.ok(createdSession);
    }
    
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long sessionId) {
        trainerService.deleteSession(sessionId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{trainerId}/settings")
    public ResponseEntity<TrainerSettingsDTO> getTrainerSettings(@PathVariable Long trainerId) {
        TrainerSettingsDTO settings = trainerService.getTrainerSettings(trainerId);
        return ResponseEntity.ok(settings);
    }
    
    @PutMapping("/{trainerId}/settings")
    public ResponseEntity<TrainerSettingsDTO> updateTrainerSettings(
            @PathVariable Long trainerId,
            @RequestBody TrainerSettingsDTO settingsDTO) {
        
        TrainerSettingsDTO updatedSettings = trainerService.updateTrainerSettings(trainerId, settingsDTO);
        return ResponseEntity.ok(updatedSettings);
    }
    
    @GetMapping("/{trainerId}/registration-requests")
    public ResponseEntity<List<TrainerRegistrationRequestDTO>> getRegistrationRequests(@PathVariable Long trainerId) {
        List<TrainerRegistrationRequestDTO> requests = trainerService.getRegistrationRequests(trainerId);
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping("/registration-requests/{requestId}/approve")
    public ResponseEntity<TrainerClientDTO> approveRegistrationRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, Integer> requestBody) {
        
        Integer sessionCount = requestBody.get("sessionCount");
        if (sessionCount == null) {
            sessionCount = 1; // Default to 1 session if not specified
        }
        
        TrainerClientDTO client = trainerService.approveRegistrationRequest(requestId, sessionCount);
        return ResponseEntity.ok(client);
    }
    
    @DeleteMapping("/registration-requests/{requestId}")
    public ResponseEntity<Void> rejectRegistrationRequest(@PathVariable Long requestId) {
        trainerService.rejectRegistrationRequest(requestId);
        return ResponseEntity.ok().build();
    }
}
