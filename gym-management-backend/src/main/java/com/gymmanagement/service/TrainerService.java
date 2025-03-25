package com.gymmanagement.service;

import com.gymmanagement.dto.TrainerClientResponse;
import com.gymmanagement.dto.TrainerRequestResponse;
import com.gymmanagement.dto.TrainerSessionRequest;
import com.gymmanagement.dto.TrainerSessionResponse;
import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.TrainerRegistrationRequest;
import com.gymmanagement.model.TrainerSession;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.TrainerRegistrationRequestRepository;
import com.gymmanagement.repository.TrainerSessionRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    
    @Autowired
    private TrainerSessionRepository sessionRepository;
    
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
        
        // Also create an initial session based on the requested meeting date/time
        if (request.getRequestedMeetingDate() != null && request.getRequestedMeetingTime() != null) {
            System.out.println("Creating initial session for client " + request.getClient().getId() + 
                               " on " + request.getRequestedMeetingDate() + 
                               " at " + request.getRequestedMeetingTime());
            
            TrainerSession initialSession = new TrainerSession();
            initialSession.setTrainer(request.getTrainer());
            initialSession.setClient(request.getClient());
            initialSession.setSessionDate(request.getRequestedMeetingDate());
            initialSession.setSessionTime(request.getRequestedMeetingTime());
            initialSession.setSessionType("Initial Consultation"); // Default session type for first meeting
            initialSession.setNotes("Automatically created from registration request #" + requestId);
            
            TrainerSession savedSession = sessionRepository.save(initialSession);
            System.out.println("Successfully created session with ID: " + savedSession.getId());
        } else {
            System.out.println("Could not create initial session - meeting date or time is null");
        }
        
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
    
    // Session management methods
    public List<TrainerSessionResponse> getTrainerSessions(Long trainerId) {
        try {
            List<TrainerSession> sessions = sessionRepository.findByTrainerId(trainerId);
            
            return sessions.stream().map(session -> TrainerSessionResponse.builder()
                    .id(session.getId())
                    .clientId(session.getClient().getId())
                    .clientName(session.getClient().getFirstName() + " " + session.getClient().getLastName())
                    .sessionDate(session.getSessionDate())
                    .sessionTime(session.getSessionTime())
                    .sessionType(session.getSessionType())
                    .notes(session.getNotes())
                    .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching trainer sessions: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    public List<TrainerSessionResponse> getTrainerSessionsForToday(Long trainerId) {
        try {
            LocalDate today = LocalDate.now();
            List<TrainerSession> sessions = sessionRepository.findByTrainerIdAndSessionDate(trainerId, today);
            
            return sessions.stream().map(session -> TrainerSessionResponse.builder()
                    .id(session.getId())
                    .clientId(session.getClient().getId())
                    .clientName(session.getClient().getFirstName() + " " + session.getClient().getLastName())
                    .sessionDate(session.getSessionDate())
                    .sessionTime(session.getSessionTime())
                    .sessionType(session.getSessionType())
                    .notes(session.getNotes())
                    .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching today's trainer sessions: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    @Transactional
    public TrainerSessionResponse createSession(Long trainerId, TrainerSessionRequest request) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + trainerId));
        
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + request.getClientId()));
        
        TrainerSession session = new TrainerSession();
        session.setTrainer(trainer);
        session.setClient(client);
        session.setSessionDate(request.getSessionDate());
        session.setSessionTime(request.getSessionTime());
        session.setSessionType(request.getSessionType());
        session.setNotes(request.getNotes());
        
        TrainerSession savedSession = sessionRepository.save(session);
        
        return TrainerSessionResponse.builder()
                .id(savedSession.getId())
                .clientId(savedSession.getClient().getId())
                .clientName(savedSession.getClient().getFirstName() + " " + savedSession.getClient().getLastName())
                .sessionDate(savedSession.getSessionDate())
                .sessionTime(savedSession.getSessionTime())
                .sessionType(savedSession.getSessionType())
                .notes(savedSession.getNotes())
                .build();
    }
    
    @Transactional
    public void deleteSession(Long sessionId) {
        sessionRepository.deleteById(sessionId);
    }
}
