package com.gymmanagement.controller;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import com.gymmanagement.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerEmployeeDetailsRepository trainerEmployeeDetailsRepository;

    @Autowired
    private TrainerSessionRepository trainerSessionRepository;

    @Autowired
    private GroupWorkoutRepository groupWorkoutRepository;

    @Autowired
    private GroupWorkoutSessionRepository groupWorkoutSessionRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;
    
    @Autowired
    private GeneralPriceRepository generalPriceRepository;
    
    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/trainers")
    public ResponseEntity<?> getAllTrainers() {
        try {
            // Get all users with TRAINER role
            List<User> trainers = userRepository.findByRole("TRAINER");
            
            // Get the latest salary expense
            Optional<Expense> latestSalaryExpense = expenseRepository.findAll().stream()
                .filter(e -> e.getCategory().getId() == 4) // Assuming category_id 4 is for salaries
                .max(Comparator.comparing(Expense::getDate));
            
            LocalDate lastSalaryDate = latestSalaryExpense.map(Expense::getDate).orElse(LocalDate.now().minusMonths(1));
            LocalDate currentDate = LocalDate.now();
            
            List<Map<String, Object>> result = new ArrayList<>();
            
            for (User trainer : trainers) {
                Map<String, Object> trainerData = new HashMap<>();
                trainerData.put("id", trainer.getId());
                trainerData.put("name", trainer.getFirstName());
                trainerData.put("surname", trainer.getLastName());
                trainerData.put("email", trainer.getEmail());
                trainerData.put("phone", trainer.getPhoneNumber());
                
                // Get employee details
                Optional<TrainerEmployeeDetails> employeeDetails = trainerEmployeeDetailsRepository.findByUserId(trainer.getId());
                if (employeeDetails.isPresent()) {
                    trainerData.put("salary", employeeDetails.get().getSalary());
                    trainerData.put("hoursPerWeek", employeeDetails.get().getWeeklyHours());
                } else {
                    trainerData.put("salary", 0);
                    trainerData.put("hoursPerWeek", 0);
                }
                
                // Count personal training sessions
                List<TrainerSession> personalSessions = trainerSessionRepository.findByTrainerId(trainer.getId()).stream()
                    .filter(session -> (session.getSessionDate().isAfter(lastSalaryDate) || session.getSessionDate().isEqual(lastSalaryDate))
                        && (session.getSessionDate().isBefore(currentDate) || session.getSessionDate().isEqual(currentDate)))
                    .collect(Collectors.toList());
                
                trainerData.put("personalTrainings", personalSessions.size());
                
                // Count group workout sessions
                List<GroupWorkout> groupWorkouts = groupWorkoutRepository.findByTrainer(trainer);
                List<Integer> groupWorkoutIds = groupWorkouts.stream().map(GroupWorkout::getId).collect(Collectors.toList());
                
                int groupSessionsCount = 0;
                for (Integer groupWorkoutId : groupWorkoutIds) {
                    List<GroupWorkoutSession> sessions = groupWorkoutSessionRepository.findByGroupWorkoutId(groupWorkoutId).stream()
                        .filter(session -> (session.getDate().isAfter(lastSalaryDate) || session.getDate().isEqual(lastSalaryDate))
                            && (session.getDate().isBefore(currentDate) || session.getDate().isEqual(currentDate)))
                        .collect(Collectors.toList());
                    groupSessionsCount += sessions.size();
                }
                
                trainerData.put("groupClasses", groupSessionsCount);
                trainerData.put("shiftSchedule", "/s1.jpg"); // Mock data for shift
                
                result.add(trainerData);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("employees", result);
            response.put("lastSalaryDate", lastSalaryDate.toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/pay-salaries")
    @Transactional
    public ResponseEntity<?> paySalaries() {
        try {
            // Get all trainers
            List<User> trainers = userRepository.findByRole("TRAINER");
            
            // Get the latest salary expense date
            Optional<Expense> latestSalaryExpense = expenseRepository.findAll().stream()
                .filter(e -> e.getCategory().getId() == 4) // Assuming category_id 4 is for salaries
                .max(Comparator.comparing(Expense::getDate));
            
            LocalDate lastSalaryDate = latestSalaryExpense.map(Expense::getDate).orElse(LocalDate.now().minusMonths(1));
            LocalDate currentDate = LocalDate.now();
            
            // Get general prices
            GeneralPrice personalTrainingPrice = generalPriceRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("Personal training price not found"));
            
            GeneralPrice groupClassPrice = generalPriceRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Group class price not found"));
            
            // Calculate total expenses
            BigDecimal baseSalaryTotal = BigDecimal.ZERO;
            BigDecimal personalTrainingTotal = BigDecimal.ZERO;
            BigDecimal groupClassesTotal = BigDecimal.ZERO;
            
            for (User trainer : trainers) {
                // Add base salary
                Optional<TrainerEmployeeDetails> employeeDetails = trainerEmployeeDetailsRepository.findByUserId(trainer.getId());
                if (employeeDetails.isPresent()) {
                    baseSalaryTotal = baseSalaryTotal.add(employeeDetails.get().getSalary());
                }
                
                // Calculate personal training commission (20% of price)
                List<TrainerSession> personalSessions = trainerSessionRepository.findByTrainerId(trainer.getId()).stream()
                    .filter(session -> (session.getSessionDate().isAfter(lastSalaryDate) || session.getSessionDate().isEqual(lastSalaryDate))
                        && (session.getSessionDate().isBefore(currentDate) || session.getSessionDate().isEqual(currentDate)))
                    .collect(Collectors.toList());
                
                BigDecimal personalSessionCommission = personalTrainingPrice.getPrice()
                    .multiply(new BigDecimal("0.20"))
                    .multiply(new BigDecimal(personalSessions.size()));
                
                personalTrainingTotal = personalTrainingTotal.add(personalSessionCommission);
                
                // Calculate group class payments (4x price)
                List<GroupWorkout> groupWorkouts = groupWorkoutRepository.findByTrainer(trainer);
                List<Integer> groupWorkoutIds = groupWorkouts.stream().map(GroupWorkout::getId).collect(Collectors.toList());
                
                int groupSessionsCount = 0;
                for (Integer groupWorkoutId : groupWorkoutIds) {
                    List<GroupWorkoutSession> sessions = groupWorkoutSessionRepository.findByGroupWorkoutId(groupWorkoutId).stream()
                        .filter(session -> (session.getDate().isAfter(lastSalaryDate) || session.getDate().isEqual(lastSalaryDate))
                            && (session.getDate().isBefore(currentDate) || session.getDate().isEqual(currentDate)))
                        .collect(Collectors.toList());
                    groupSessionsCount += sessions.size();
                }
                
                BigDecimal groupClassPayment = groupClassPrice.getPrice()
                    .multiply(new BigDecimal("4"))
                    .multiply(new BigDecimal(groupSessionsCount));
                
                groupClassesTotal = groupClassesTotal.add(groupClassPayment);
            }
            
            // Calculate total amount
            BigDecimal totalAmount = baseSalaryTotal.add(personalTrainingTotal).add(groupClassesTotal);
            
            // Create expense record
            ExpenseCategory salaryCategory = expenseCategoryRepository.findById(4)
                .orElseThrow(() -> new RuntimeException("Salary expense category not found"));
            
            Expense salaryExpense = new Expense();
            salaryExpense.setCategory(salaryCategory);
            salaryExpense.setAmount(totalAmount);
            salaryExpense.setDate(currentDate);
            
            expenseRepository.save(salaryExpense);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Salaries paid successfully");
            response.put("date", currentDate.toString());
            response.put("amount", totalAmount);
            response.put("details", Map.of(
                "baseSalary", baseSalaryTotal,
                "personalTrainingCommission", personalTrainingTotal,
                "groupClassPayments", groupClassesTotal
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/trainers")
    @Transactional
    public ResponseEntity<?> addTrainer(@RequestBody Map<String, Object> request) {
        try {
            // Create new user with TRAINER role
            User newTrainer = new User();
            newTrainer.setFirstName(request.get("name").toString());
            newTrainer.setLastName(request.get("surname").toString());
            newTrainer.setEmail(request.get("email").toString());
            newTrainer.setPhoneNumber(request.get("phone").toString());
            newTrainer.setRole("TRAINER");
            newTrainer.setRegistrationDate(LocalDateTime.now());
            newTrainer.setProfilePhotoPath("/uploads/images/default-avatar.jpg");
            
            // Set default password and encrypt it
            newTrainer.setPassword(passwordEncoder.encode("trainer123"));
            
            // Save the user
            User savedTrainer = userRepository.save(newTrainer);
            
            // Create trainer employee details
            TrainerEmployeeDetails employeeDetails = new TrainerEmployeeDetails();
            employeeDetails.setUser(savedTrainer);
            employeeDetails.setWeeklyHours(Integer.parseInt(request.get("hoursPerWeek").toString()));
            
            // Convert salary to BigDecimal
            String salaryStr = request.get("salary").toString().replace("₺", "").replace(",", "");
            employeeDetails.setSalary(new BigDecimal(salaryStr));
            
            // Save employee details
            trainerEmployeeDetailsRepository.save(employeeDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee added successfully");
            response.put("id", savedTrainer.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/trainers/{id}")
    @Transactional
    public ResponseEntity<?> updateTrainer(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            // Find the user
            User trainer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + id));
            
            // Update user fields
            trainer.setFirstName(request.get("name").toString());
            trainer.setLastName(request.get("surname").toString());
            trainer.setEmail(request.get("email").toString());
            trainer.setPhoneNumber(request.get("phone").toString());
            
            // Save updated user
            userRepository.save(trainer);
            
            // Update employee details
            TrainerEmployeeDetails employeeDetails = trainerEmployeeDetailsRepository.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Employee details not found for trainer id: " + id));
            
            employeeDetails.setWeeklyHours(Integer.parseInt(request.get("hoursPerWeek").toString()));
            
            // Convert salary to BigDecimal
            String salaryStr = request.get("salary").toString().replace("₺", "").replace(",", "");
            employeeDetails.setSalary(new BigDecimal(salaryStr));
            
            // Save updated employee details
            trainerEmployeeDetailsRepository.save(employeeDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/trainers/{id}")
    @Transactional
    public ResponseEntity<?> deleteTrainer(@PathVariable Long id) {
        try {
            // Find user
            User trainer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + id));
            
            // Find employee details
            Optional<TrainerEmployeeDetails> employeeDetails = trainerEmployeeDetailsRepository.findByUserId(id);
            
            // Delete employee details if exists
            employeeDetails.ifPresent(details -> trainerEmployeeDetailsRepository.delete(details));
            
            // Delete user
            userRepository.delete(trainer);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 