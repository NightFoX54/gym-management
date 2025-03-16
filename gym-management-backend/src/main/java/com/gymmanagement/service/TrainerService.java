package com.gymmanagement.service;

import com.gymmanagement.dto.TrainerClientResponse;
import com.gymmanagement.dto.TrainerRequestResponse;
import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.TrainerRegistrationRequest;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.TrainerRegistrationRequestRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainerService {

    @Autowired
    private TrainerClientRepository clientRepository;
    
    @Autowired
    private TrainerRegistrationRequestRepository requestRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<TrainerClientResponse> getTrainerClients(Long trainerId) {
        List<TrainerClient> clients = clientRepository.findByTrainerId(trainerId);
        
        return clients.stream().map(client -> TrainerClientResponse.builder()
                .id(client.getId())
                .clientId(client.getClient().getId())
                .name(client.getClient().getFirstName() + " " + client.getClient().getLastName())
                .email(client.getClient().getEmail())
                .phone(client.getClient().getPhoneNumber())
                .profilePhoto(client.getClient().getProfilePhotoPath())
                .registrationDate(client.getRegistrationDate())
                .remainingSessions(client.getRemainingSessions())
                .status(client.getRemainingSessions() > 0 ? "Active" : "Completed")
                .build())
                .collect(Collectors.toList());
    }
    
    public List<TrainerRequestResponse> getTrainerRequests(Long trainerId) {
        try {
            System.out.println("Service: Fetching requests for trainer ID: " + trainerId);
            List<TrainerRegistrationRequest> requests = requestRepository.findByTrainerId(trainerId);
            System.out.println("Service: Found " + requests.size() + " requests in DB");
            
            if (requests.isEmpty()) {
                // For testing: If no requests found for this trainer, return an empty list
                System.out.println("No requests found for trainer ID: " + trainerId);
                return new ArrayList<>();
            }
            
            return requests.stream().map(request -> {
                User client = request.getClient();
                return TrainerRequestResponse.builder()
                    .id(request.getId())
                    .clientId(client.getId())
                    .name(client.getFirstName() + " " + client.getLastName())
                    .email(client.getEmail())
                    .phone(client.getPhoneNumber())
                    .program("Training Program") // Default program value
                    .message(request.getRequestMessage())
                    .meetingDate(request.getRequestedMeetingDate())
                    .meetingTime(request.getRequestedMeetingTime())
                    .build();
            }).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching trainer requests: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>(); // Return empty list instead of throwing exception
        }
    }
    
    @Transactional
    public TrainerClientResponse approveRequest(Long requestId, Integer initialSessions) {
        TrainerRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        
        // Create new trainer-client relationship
        TrainerClient newClient = new TrainerClient();
        newClient.setTrainer(request.getTrainer());
        newClient.setClient(request.getClient());
        newClient.setRegistrationDate(LocalDateTime.now());
        newClient.setRemainingSessions(initialSessions);
        
        TrainerClient savedClient = clientRepository.save(newClient);
        
        // Delete the request once processed
        requestRepository.delete(request);
        
        return TrainerClientResponse.builder()
                .id(savedClient.getId())
                .clientId(savedClient.getClient().getId())
                .name(savedClient.getClient().getFirstName() + " " + savedClient.getClient().getLastName())
                .email(savedClient.getClient().getEmail())
                .phone(savedClient.getClient().getPhoneNumber())
                .profilePhoto(savedClient.getClient().getProfilePhotoPath())
                .registrationDate(savedClient.getRegistrationDate())
                .remainingSessions(savedClient.getRemainingSessions())
                .status("Active")
                .build();
    }
    
    @Transactional
    public void rejectRequest(Long requestId) {
        TrainerRegistrationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        
        requestRepository.delete(request);
    }
    
    @Transactional
    public void deleteClient(Long clientId) {
        clientRepository.deleteById(clientId);
    }
    
    @Transactional
    public TrainerClientResponse updateClientSessions(Long clientId, Integer sessions) {
        TrainerClient client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
        
        client.setRemainingSessions(sessions);
        TrainerClient savedClient = clientRepository.save(client);
        
        return TrainerClientResponse.builder()
                .id(savedClient.getId())
                .clientId(savedClient.getClient().getId())
                .name(savedClient.getClient().getFirstName() + " " + savedClient.getClient().getLastName())
                .email(savedClient.getClient().getEmail())
                .phone(savedClient.getClient().getPhoneNumber())
                .profilePhoto(savedClient.getClient().getProfilePhotoPath())
                .registrationDate(savedClient.getRegistrationDate())
                .remainingSessions(savedClient.getRemainingSessions())
                .status(savedClient.getRemainingSessions() > 0 ? "Active" : "Completed")
                .build();
    }
}
