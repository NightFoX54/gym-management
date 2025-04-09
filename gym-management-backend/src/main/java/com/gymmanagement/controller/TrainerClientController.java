package com.gymmanagement.controller;

import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainer-client")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class TrainerClientController {

    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/find")
    @Transactional
    public ResponseEntity<?> findOrCreateTrainerClientRelationship(@RequestBody Map<String, Object> requestData) {
        try {
            Long trainerId = Long.parseLong(requestData.get("trainerId").toString());
            Long clientId = Long.parseLong(requestData.get("clientId").toString());
            
            // Find trainer and client users
            User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
            
            User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
            
            // Check if relationship already exists
            Optional<TrainerClient> existingRelationship = 
                trainerClientRepository.findByTrainerAndClient(trainer, client);
            
            TrainerClient trainerClient;
            
            if (existingRelationship.isPresent()) {
                trainerClient = existingRelationship.get();
            } else {
                // Create new relationship
                trainerClient = new TrainerClient();
                trainerClient.setTrainer(trainer);
                trainerClient.setClient(client);
                trainerClient.setRemainingSessions(0);
                trainerClient = trainerClientRepository.save(trainerClient);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", trainerClient.getId());
            response.put("trainerId", trainer.getId());
            response.put("clientId", client.getId());
            response.put("remainingSessions", trainerClient.getRemainingSessions());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to find or create relationship: " + e.getMessage()));
        }
    }
} 