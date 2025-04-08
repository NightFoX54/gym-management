package com.gymmanagement.controller;

import com.gymmanagement.model.ClubVisit;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.ClubVisitRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/club-visits")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
public class ClubVisitController {

    @Autowired
    private ClubVisitRepository clubVisitRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getWorkoutStatus(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            Optional<ClubVisit> activeVisit = clubVisitRepository.findTopByUserAndCheckOutDateIsNullOrderByIdDesc(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isCheckedIn", activeVisit.isPresent());
            if (activeVisit.isPresent()) {
                response.put("visitId", activeVisit.get().getId());
                response.put("checkInDate", activeVisit.get().getCheckInDate().toString());
                response.put("checkInTime", activeVisit.get().getCheckInTime().toString());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            // Check if user already has an active visit
            Optional<ClubVisit> activeVisit = clubVisitRepository.findTopByUserAndCheckOutDateIsNullOrderByIdDesc(user);
            if (activeVisit.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "User already has an active workout"));
            }
            
            ClubVisit visit = new ClubVisit();
            visit.setUser(user);
            visit.setCheckInDate(LocalDate.now());
            visit.setCheckInTime(LocalTime.now());
            
            ClubVisit savedVisit = clubVisitRepository.save(visit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("visitId", savedVisit.getId());
            response.put("checkInDate", savedVisit.getCheckInDate().toString());
            response.put("checkInTime", savedVisit.getCheckInTime().toString());
            response.put("message", "Workout started successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    
    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            // Find the active visit
            Optional<ClubVisit> activeVisitOpt = clubVisitRepository.findTopByUserAndCheckOutDateIsNullOrderByIdDesc(user);
            if (activeVisitOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "No active workout found"));
            }
            
            ClubVisit activeVisit = activeVisitOpt.get();
            activeVisit.setCheckOutDate(LocalDate.now());
            activeVisit.setCheckOutTime(LocalTime.now());
            
            ClubVisit updatedVisit = clubVisitRepository.save(activeVisit);
            
            Map<String, Object> response = new HashMap<>();
            response.put("visitId", updatedVisit.getId());
            response.put("checkOutDate", updatedVisit.getCheckOutDate().toString());
            response.put("checkOutTime", updatedVisit.getCheckOutTime().toString());
            response.put("message", "Workout finished successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/attendance/{userId}")
    public ResponseEntity<?> getAttendanceStats(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            
            // Get current date info
            LocalDate today = LocalDate.now();
            LocalDate firstDayOfMonth = today.withDayOfMonth(1);
            LocalDate firstDayOfLastMonth = today.minusMonths(1).withDayOfMonth(1);
            LocalDate lastDayOfLastMonth = firstDayOfMonth.minusDays(1);
            
            // Find all visits for this user
            List<ClubVisit> allVisits = clubVisitRepository.findByUser(user);
            
            // Calculate total visits
            long totalVisits = allVisits.size();
            
            // Calculate this month's visits
            long thisMonthVisits = allVisits.stream()
                .filter(visit -> !visit.getCheckInDate().isBefore(firstDayOfMonth))
                .count();
            
            // Calculate last month's visits
            long lastMonthVisits = allVisits.stream()
                .filter(visit -> !visit.getCheckInDate().isBefore(firstDayOfLastMonth) && !visit.getCheckInDate().isAfter(lastDayOfLastMonth))
                .count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("total", totalVisits);
            response.put("thisMonth", thisMonthVisits);
            response.put("lastMonth", lastMonthVisits);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
} 