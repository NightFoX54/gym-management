package com.gymmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.model.TrainerSettings;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerSettingsRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.dto.CustomerDTO;
import com.gymmanagement.dto.EmployeeDTO;
import com.gymmanagement.service.UserService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.PUT})
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrainerSettingsRepository trainerSettingsRepository;
    
    @Autowired
    private UserService userService;
    
    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<Map<String, Object>>> getUsersByRole(@PathVariable String role) {
        try {
            List<User> users = userRepository.findByRole(role.toUpperCase());
            List<Map<String, Object>> response = new ArrayList<>();
            
            for (User user : users) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("firstName", user.getFirstName());
                userInfo.put("lastName", user.getLastName());
                userInfo.put("email", user.getEmail());
                userInfo.put("phoneNumber", user.getPhoneNumber());
                userInfo.put("profilePhoto", user.getProfilePhotoPath());
                
                // Add trainer-specific details if role is TRAINER
                if (role.equalsIgnoreCase("TRAINER")) {
                    Optional<TrainerSettings> settings = trainerSettingsRepository.findByTrainerId(user.getId());
                    if (settings.isPresent()) {
                        TrainerSettings trainerSettings = settings.get();
                        userInfo.put("bio", trainerSettings.getBio());
                        userInfo.put("specialization", trainerSettings.getSpecialization());
                    } else {
                        userInfo.put("bio", "");
                        userInfo.put("specialization", "");
                    }
                }
                
                response.add(userInfo);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }

    // Endpoint to get all customers (users with MEMBER role)
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        try {
            List<CustomerDTO> customers = userService.getAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            // Log the exception details
            System.err.println("Error fetching customers: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint to get all employees (users with specific roles like TRAINER, STAFF etc.)
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        try {
            List<EmployeeDTO> employees = userService.getAllEmployees();
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            System.err.println("Error fetching employees: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
