package com.gymmanagement.controller;

import com.gymmanagement.model.PersonalTrainingRating;
import com.gymmanagement.model.TrainerSession;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.PersonalTrainingRatingRepository;
import com.gymmanagement.repository.TrainerSessionRepository;
import com.gymmanagement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/training-ratings")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT})
public class TrainingRatingController {

    @Autowired
    private PersonalTrainingRatingRepository ratingRepository;
    
    @Autowired
    private TrainerSessionRepository sessionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getRatingBySession(@PathVariable Long sessionId) {
        Optional<PersonalTrainingRating> rating = ratingRepository.findBySessionId(sessionId);
        if (rating.isPresent()) {
            return ResponseEntity.ok(rating.get());
        } else {
            return ResponseEntity.ok(Map.of("message", "No rating found for this session"));
        }
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> getRatingsByMember(@PathVariable Long memberId) {
        List<PersonalTrainingRating> ratings = ratingRepository.findByMemberId(memberId);
        return ResponseEntity.ok(ratings);
    }
    
    @PostMapping
    public ResponseEntity<?> createRating(@RequestBody Map<String, Object> ratingData) {
        try {
            Long memberId = Long.parseLong(ratingData.get("memberId").toString());
            Long sessionId = Long.parseLong(ratingData.get("sessionId").toString());
            Integer ratingValue = Integer.parseInt(ratingData.get("rating").toString());
            String comment = (String) ratingData.get("comment");
            
            // Validate member and session
            User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with id: " + memberId));
                
            TrainerSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));
            
            // Check if rating already exists
            Optional<PersonalTrainingRating> existingRating = ratingRepository.findBySessionId(sessionId);
            if (existingRating.isPresent()) {
                // Update existing rating
                PersonalTrainingRating rating = existingRating.get();
                rating.setRating(ratingValue);
                rating.setComment(comment);
                ratingRepository.save(rating);
                return ResponseEntity.ok(Map.of("message", "Rating updated successfully", "rating", rating));
            } else {
                // Create new rating
                PersonalTrainingRating newRating = new PersonalTrainingRating();
                newRating.setMember(member);
                newRating.setSession(session);
                newRating.setRating(ratingValue);
                newRating.setComment(comment);
                
                PersonalTrainingRating savedRating = ratingRepository.save(newRating);
                return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Rating created successfully", "rating", savedRating));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to save rating: " + e.getMessage()));
        }
    }
} 