package com.gymmanagement.controller;

import com.gymmanagement.dto.TrainerClientResponse;
import com.gymmanagement.dto.TrainerRequestResponse;
import com.gymmanagement.dto.TrainerSessionRequest;
import com.gymmanagement.dto.TrainerSessionResponse;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.gymmanagement.model.TrainerSettings;
import com.gymmanagement.repository.TrainerSettingsRepository;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.PUT})
public class TrainerController {

    @Autowired
    private TrainerService trainerService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrainerSettingsRepository trainerSettingsRepository;

    @GetMapping("/{trainerId}/clients")
    public ResponseEntity<List<TrainerClientResponse>> getTrainerClients(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainerService.getTrainerClients(trainerId));
    }

    @GetMapping("/{trainerId}/requests")
    public ResponseEntity<List<TrainerRequestResponse>> getTrainerRequests(@PathVariable Long trainerId) {
        System.out.println("Fetching requests for trainer ID: " + trainerId);
        List<TrainerRequestResponse> requests = trainerService.getTrainerRequests(trainerId);
        System.out.println("Found " + requests.size() + " requests");
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping("/requests/{requestId}/approve")
    public ResponseEntity<TrainerClientResponse> approveRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, Integer> payload) {
        Integer sessions = payload.get("initialSessions");
        return ResponseEntity.ok(trainerService.approveRequest(requestId, sessions));
    }
    
    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long requestId) {
        trainerService.rejectRequest(requestId);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/clients/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long clientId) {
        trainerService.deleteClient(clientId);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/clients/{clientId}/sessions")
    public ResponseEntity<TrainerClientResponse> updateClientSessions(
            @PathVariable Long clientId,
            @RequestBody Map<String, Integer> payload) {
        Integer sessions = payload.get("sessions");
        return ResponseEntity.ok(trainerService.updateClientSessions(clientId, sessions));
    }
    
    // New endpoints for trainer sessions
    @GetMapping("/{trainerId}/sessions")
    public ResponseEntity<List<TrainerSessionResponse>> getTrainerSessions(@PathVariable Long trainerId) {
        return ResponseEntity.ok(trainerService.getTrainerSessions(trainerId));
    }
    
    @PostMapping("/{trainerId}/sessions")
    public ResponseEntity<TrainerSessionResponse> createSession(
            @PathVariable Long trainerId,
            @RequestBody TrainerSessionRequest request) {
        return ResponseEntity.ok(trainerService.createSession(trainerId, request));
    }
    
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long sessionId) {
        trainerService.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{trainerId}/profile")
    public ResponseEntity<Map<String, Object>> getTrainerProfile(@PathVariable Long trainerId) {
        System.out.println("Fetching profile for trainer ID: " + trainerId);
        try {
            User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + trainerId));
                
            if (!trainer.getRole().equals("TRAINER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "User is not a trainer"));
            }
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", trainer.getId());
            profile.put("firstName", trainer.getFirstName());
            profile.put("lastName", trainer.getLastName());
            profile.put("fullName", trainer.getFirstName() + " " + trainer.getLastName());
            profile.put("email", trainer.getEmail());
            profile.put("phone", trainer.getPhoneNumber());
            profile.put("profilePhoto", trainer.getProfilePhotoPath());
            profile.put("role", trainer.getRole());
            profile.put("registrationDate", trainer.getRegistrationDate());
            
            // Add trainer settings if available
            Optional<TrainerSettings> settings = trainerSettingsRepository.findByTrainerId(trainerId);
            if (settings.isPresent()) {
                TrainerSettings trainerSettings = settings.get();
                profile.put("bio", trainerSettings.getBio());
                profile.put("specialization", trainerSettings.getSpecialization());
                profile.put("newClientNotifications", trainerSettings.getNewClientNotifications());
                profile.put("progressUpdateNotifications", trainerSettings.getProgressUpdateNotifications());
                profile.put("mobileNotifications", trainerSettings.getMobileNotifications());
                profile.put("desktopNotifications", trainerSettings.getDesktopNotifications());
            } else {
                // Default values if no settings found
                profile.put("bio", "");
                profile.put("specialization", "");
                profile.put("newClientNotifications", true);
                profile.put("progressUpdateNotifications", true);
                profile.put("mobileNotifications", true);
                profile.put("desktopNotifications", true);
            }
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            System.err.println("Controller error in getTrainerProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch trainer profile: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{trainerId}/profile")
    public ResponseEntity<?> updateTrainerProfile(
            @PathVariable Long trainerId,
            @RequestBody Map<String, Object> profileData) {
        System.out.println("Updating profile for trainer ID: " + trainerId);
        try {
            User trainer = userRepository.findById(trainerId)
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + trainerId));
            
            if (!trainer.getRole().equals("TRAINER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "User is not a trainer"));
            }
            
            // Update basic user information
            if (profileData.containsKey("firstName")) {
                String firstName = (String) profileData.get("firstName");
                // Truncate if needed
                if (firstName != null && firstName.length() > 255) {
                    firstName = firstName.substring(0, 255);
                }
                trainer.setFirstName(firstName);
            }
            
            if (profileData.containsKey("lastName")) {
                String lastName = (String) profileData.get("lastName");
                // Truncate if needed
                if (lastName != null && lastName.length() > 255) {
                    lastName = lastName.substring(0, 255);
                }
                trainer.setLastName(lastName);
            }
            
            if (profileData.containsKey("email")) {
                String newEmail = (String) profileData.get("email");
                if (newEmail != null && newEmail.length() > 255) {
                    newEmail = newEmail.substring(0, 255);
                }
                // Check if email already exists for another user
                if (!newEmail.equals(trainer.getEmail()) && userRepository.existsByEmail(newEmail)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("error", "Email already in use"));
                }
                trainer.setEmail(newEmail);
            }
            
            if (profileData.containsKey("phoneNumber")) {
                String phoneNumber = (String) profileData.get("phoneNumber");
                if (phoneNumber != null && phoneNumber.length() > 255) {
                    phoneNumber = phoneNumber.substring(0, 255);
                }
                trainer.setPhoneNumber(phoneNumber);
            }
            
            if (profileData.containsKey("profilePhoto")) {
                String profilePhoto = (String) profileData.get("profilePhoto");
                // If it's a data URL, it might be very long. Store it separately or limit size
                if (profilePhoto != null && profilePhoto.startsWith("data:") && profilePhoto.length() > 255) {
                    // Either truncate or handle differently (e.g., save to file system)
                    // For now, leave it as-is since we're not handling actual file uploads
                    trainer.setProfilePhotoPath("/uploads/images/default-avatar.jpg");
                } else if (profilePhoto != null) {
                    trainer.setProfilePhotoPath(profilePhoto);
                }
            }
            
            // Save the updated trainer
            User updatedTrainer = userRepository.save(trainer);
            
            // Handle trainer settings
            TrainerSettings settings = trainerSettingsRepository.findByTrainerId(trainerId)
                .orElse(new TrainerSettings());
            
            if (settings.getId() == null) {
                settings.setTrainer(trainer);
            }
            
            if (profileData.containsKey("bio")) {
                String bio = (String) profileData.get("bio");
                if (bio != null && bio.length() > 2000) {
                    bio = bio.substring(0, 2000);
                }
                settings.setBio(bio);
            }
            
            if (profileData.containsKey("specialization")) {
                String specialization = (String) profileData.get("specialization");
                if (specialization != null && specialization.length() > 1000) {
                    specialization = specialization.substring(0, 1000);
                }
                settings.setSpecialization(specialization);
            }
            
            if (profileData.containsKey("newClientNotifications")) {
                settings.setNewClientNotifications((Boolean) profileData.get("newClientNotifications"));
            }
            
            if (profileData.containsKey("progressUpdateNotifications")) {
                settings.setProgressUpdateNotifications((Boolean) profileData.get("progressUpdateNotifications"));
            }
            
            if (profileData.containsKey("mobileNotifications")) {
                settings.setMobileNotifications((Boolean) profileData.get("mobileNotifications"));
            }
            
            if (profileData.containsKey("desktopNotifications")) {
                settings.setDesktopNotifications((Boolean) profileData.get("desktopNotifications"));
            }
            
            TrainerSettings savedSettings = trainerSettingsRepository.save(settings);
            
            // Prepare response with updated data
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedTrainer.getId());
            response.put("firstName", updatedTrainer.getFirstName());
            response.put("lastName", updatedTrainer.getLastName());
            response.put("fullName", updatedTrainer.getFirstName() + " " + updatedTrainer.getLastName());
            response.put("email", updatedTrainer.getEmail());
            response.put("phone", updatedTrainer.getPhoneNumber());
            response.put("profilePhoto", updatedTrainer.getProfilePhotoPath());
            response.put("role", updatedTrainer.getRole());
            response.put("bio", savedSettings.getBio());
            response.put("specialization", savedSettings.getSpecialization());
            response.put("newClientNotifications", savedSettings.getNewClientNotifications());
            response.put("progressUpdateNotifications", savedSettings.getProgressUpdateNotifications());
            response.put("mobileNotifications", savedSettings.getMobileNotifications());
            response.put("desktopNotifications", savedSettings.getDesktopNotifications());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Controller error in updateTrainerProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update trainer profile: " + e.getMessage()));
        }
    }
}
