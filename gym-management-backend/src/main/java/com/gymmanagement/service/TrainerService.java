package com.gymmanagement.service;

import com.gymmanagement.dto.TrainerClientResponse;
import com.gymmanagement.dto.TrainerRequestResponse;
import com.gymmanagement.dto.TrainerSessionRequest;
import com.gymmanagement.dto.TrainerSessionResponse;
import com.gymmanagement.model.FreePtUse;
import com.gymmanagement.model.PersonalTrainingRating;
import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.TrainerRegistrationRequest;
import com.gymmanagement.model.TrainerSession;
import com.gymmanagement.model.TrainerSessionRescheduleRequest;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.TrainerRegistrationRequestRepository;
import com.gymmanagement.repository.TrainerSessionRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.TrainerSessionRequestRepository;
import com.gymmanagement.repository.TrainerSessionRescheduleRequestRepository;
import com.gymmanagement.repository.FreePtUseRepository;
import com.gymmanagement.repository.PersonalTrainingRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Optional;

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
    
    @Autowired
    private TrainerSessionRequestRepository sessionRequestRepository;
    
    @Autowired
    private TrainerSessionRescheduleRequestRepository rescheduleRequestRepository;
    
    @Autowired
    private FreePtUseRepository freePtUseRepository;
    
    @Autowired
    private PersonalTrainingRatingRepository ratingRepository;
    
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
        newClient.setRemainingSessions(0);
        
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

    @Transactional
    public TrainerSessionResponse approveSessionRequest(Integer requestId) {
        // Get the session request
        com.gymmanagement.model.TrainerSessionRequest request = sessionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Session request not found with id: " + requestId));
        
        // Create new trainer session
        TrainerSession session = new TrainerSession();
        session.setTrainer(request.getTrainer());
        session.setClient(request.getClient());
        session.setSessionDate(request.getRequestedMeetingDate());
        session.setSessionTime(request.getRequestedMeetingTime());
        session.setSessionType("Regular Session"); // Default type
        session.setNotes(request.getRequestMessage());
        
        TrainerSession savedSession = sessionRepository.save(session);
        
        // Check if this session is using a free PT session
        List<FreePtUse> freePtUses = freePtUseRepository.findBySessionRequestId(request.getId());
        
        if (!freePtUses.isEmpty()) {
            // This is a free PT session
            FreePtUse freePtUse = freePtUses.get(0); // Should only be one
            freePtUse.setSessionRequest(null);
            freePtUse.setSession(savedSession);
            freePtUseRepository.save(freePtUse);
        } else {
            // This is a regular session using client's remaining sessions
            // Find the trainer-client relationship
            Optional<TrainerClient> trainerClientOpt = clientRepository.findByTrainerAndClient(
                    request.getTrainer(), request.getClient());
            
            if (trainerClientOpt.isPresent()) {
                TrainerClient trainerClient = trainerClientOpt.get();
                int remaining = trainerClient.getRemainingSessions();
                if (remaining > 0) {
                    trainerClient.setRemainingSessions(remaining - 1);
                    clientRepository.save(trainerClient);
                } else {
                    throw new RuntimeException("Client has no remaining sessions");
                }
            }
        }
        
        // Delete the request
        sessionRequestRepository.deleteById(request.getId());
        
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
    public void approveRescheduleRequest(Long requestId) {
        // Get the reschedule request
        TrainerSessionRescheduleRequest request = rescheduleRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Reschedule request not found with id: " + requestId));
        
        // Update the session with new date and time
        TrainerSession session = request.getSession();
        session.setSessionDate(request.getNewSessionDate());
        session.setSessionTime(request.getNewSessionTime());
        
        sessionRepository.save(session);
        
        // Delete the request
        rescheduleRequestRepository.deleteById(requestId);
    }

    public List<Map<String, Object>> getTrainerSessionRequests(Long trainerId) {
        List<com.gymmanagement.model.TrainerSessionRequest> requests = sessionRequestRepository.findByTrainerId(trainerId);
        
        return requests.stream().map(request -> {
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("id", request.getId());
            requestMap.put("clientId", request.getClient().getId());
            requestMap.put("name", request.getClient().getName());
            requestMap.put("email", request.getClient().getEmail());
            requestMap.put("phone", request.getClient().getPhoneNumber());
            requestMap.put("message", request.getRequestMessage());
            requestMap.put("date", request.getRequestedMeetingDate());
            requestMap.put("time", request.getRequestedMeetingTime());
            requestMap.put("type", "session"); // Identifier for the request type
            
            // Check if this is a free PT session
            List<FreePtUse> freePtUses = freePtUseRepository.findBySessionRequestId(request.getId());
            requestMap.put("isFreeSession", !freePtUses.isEmpty());
            
            return requestMap;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTrainerRescheduleRequests(Long trainerId) {
        // First find all sessions for this trainer
        List<TrainerSession> trainerSessions = sessionRepository.findByTrainerId(trainerId);
        
        // Get all reschedule requests for these sessions
        List<Map<String, Object>> result = new ArrayList<>();
        for (TrainerSession session : trainerSessions) {
            List<TrainerSessionRescheduleRequest> requests = rescheduleRequestRepository.findBySessionId(session.getId());
            
            for (TrainerSessionRescheduleRequest request : requests) {
                Map<String, Object> requestMap = new HashMap<>();
                requestMap.put("id", request.getId());
                requestMap.put("sessionId", session.getId());
                requestMap.put("clientId", session.getClient().getId());
                requestMap.put("name", session.getClient().getName());
                requestMap.put("email", session.getClient().getEmail());
                requestMap.put("phone", session.getClient().getPhoneNumber());
                requestMap.put("currentDate", session.getSessionDate());
                requestMap.put("currentTime", session.getSessionTime());
                requestMap.put("newDate", request.getNewSessionDate());
                requestMap.put("newTime", request.getNewSessionTime());
                requestMap.put("type", "reschedule"); // Identifier for the request type
                
                result.add(requestMap);
            }
        }
        
        return result;
    }

    @Transactional
    public void rejectSessionRequest(Integer requestId) {
        // Get the session request
        com.gymmanagement.model.TrainerSessionRequest request = sessionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Session request not found with id: " + requestId));
        
        // Delete any related free PT use records
        List<FreePtUse> freePtUses = freePtUseRepository.findBySessionRequestId(request.getId());
        if (!freePtUses.isEmpty()) {
            // Delete the free PT use record so it can be used later
            for (FreePtUse use : freePtUses) {
                freePtUseRepository.delete(use);
            }
        }
        
        // Delete the request
        sessionRequestRepository.deleteById(request.getId());
    }

    @Transactional
    public void rejectRescheduleRequest(Long requestId) {
        // Get the reschedule request
        TrainerSessionRescheduleRequest request = rescheduleRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Reschedule request not found with id: " + requestId));
        
        // Simply delete the request - no need to adjust any other records
        rescheduleRequestRepository.deleteById(requestId);
    }

    // Keep existing method as is - it returns ratings for all trainers
    public Map<Long, Double> getTrainerRatings() {
        Map<Long, Double> trainerRatings = new HashMap<>();
        
        // Get all trainer sessions
        List<TrainerSession> allSessions = sessionRepository.findAll();
        
        // Group sessions by trainer
        Map<Long, List<TrainerSession>> sessionsByTrainer = allSessions.stream()
                .collect(Collectors.groupingBy(session -> session.getTrainer().getId()));
        
        // For each trainer, calculate average rating
        sessionsByTrainer.forEach((trainerId, sessions) -> {
            List<Double> ratings = new ArrayList<>();
            
            // Get ratings for each session
            for (TrainerSession session : sessions) {
                Optional<PersonalTrainingRating> ratingOpt = ratingRepository.findBySessionId(session.getId());
                ratingOpt.ifPresent(rating -> ratings.add(rating.getRating().doubleValue()));
            }
            
            // Calculate average or default to 0
            double averageRating = ratings.isEmpty() ? 0 : 
                ratings.stream().mapToDouble(Double::doubleValue).average().orElse(0);
            
            trainerRatings.put(trainerId, averageRating);
        });
        
        return trainerRatings;
    }
    
    // New method for detailed ratings of a specific trainer
    public Map<String, Object> getTrainerRatingDetails(Long trainerId) {
        Map<String, Object> trainerRatingDetails = new HashMap<>();
        
        // Get all trainer sessions for this trainer
        List<TrainerSession> trainerSessions = sessionRepository.findByTrainerId(trainerId);
        
        // Get ratings for each session
        List<PersonalTrainingRating> ratings = new ArrayList<>();
        for (TrainerSession session : trainerSessions) {
            Optional<PersonalTrainingRating> ratingOpt = ratingRepository.findBySessionId(session.getId());
            ratingOpt.ifPresent(ratings::add);
        }
        
        // Calculate average rating
        double averageRating = ratings.isEmpty() ? 0 : 
            ratings.stream().mapToDouble(rating -> rating.getRating().doubleValue()).average().orElse(0);
        
        // Count ratings by value (1 through 5)
        Map<Integer, Integer> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int ratingValue = i;
            ratingDistribution.put(i, (int) ratings.stream()
                .filter(r -> r.getRating() == ratingValue).count());
        }
        
        // Get recent reviews (limit to 10)
        List<Map<String, Object>> recentReviews = ratings.stream()
            .sorted((r1, r2) -> r2.getId().compareTo(r1.getId())) // Sort by ID descending (recent first)
            .limit(10)
            .map(rating -> {
                Map<String, Object> review = new HashMap<>();
                review.put("id", rating.getId());
                review.put("clientName", rating.getMember().getFirstName() + " " + rating.getMember().getLastName());
                review.put("rating", rating.getRating());
                review.put("comment", rating.getComment());
                review.put("date", rating.getSession().getSessionDate().toString());
                return review;
            })
            .collect(Collectors.toList());
        
        // Build response
        trainerRatingDetails.put("trainerId", trainerId);
        trainerRatingDetails.put("averageRating", averageRating);
        trainerRatingDetails.put("totalReviews", ratings.size());
        trainerRatingDetails.put("ratingDistribution", ratingDistribution);
        trainerRatingDetails.put("recentReviews", recentReviews);
        
        return trainerRatingDetails;
    }
}
