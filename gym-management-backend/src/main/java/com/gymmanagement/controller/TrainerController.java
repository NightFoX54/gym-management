package com.gymmanagement.controller;

import com.gymmanagement.dto.TrainerClientResponse;
import com.gymmanagement.dto.TrainerRequestResponse;
import com.gymmanagement.dto.TrainerSessionRequest;
import com.gymmanagement.dto.TrainerSessionResponse;
import com.gymmanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH})
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

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
}
