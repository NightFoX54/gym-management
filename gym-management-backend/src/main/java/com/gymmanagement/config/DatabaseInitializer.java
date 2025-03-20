package com.gymmanagement.config;

import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.TrainerRegistrationRequest;
import com.gymmanagement.model.TrainerSession;
import com.gymmanagement.model.User;
import com.gymmanagement.model.Workout;
import com.gymmanagement.model.WorkoutCategory;
import com.gymmanagement.model.WorkoutExercise;
import com.gymmanagement.model.WorkoutLevel;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.TrainerRegistrationRequestRepository;
import com.gymmanagement.repository.TrainerSessionRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.WorkoutCategoryRepository;
import com.gymmanagement.repository.WorkoutExerciseRepository;
import com.gymmanagement.repository.WorkoutLevelRepository;
import com.gymmanagement.repository.WorkoutRepository;
import com.gymmanagement.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private TrainerRegistrationRequestRepository requestRepository;
    
    @Autowired
    private TrainerSessionRepository sessionRepository;
    
    @Autowired
    private WorkoutCategoryRepository categoryRepository;
    
    @Autowired
    private WorkoutLevelRepository levelRepository;
    
    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private WorkoutExerciseRepository exerciseRepository;
    
    @Autowired
    private WorkoutService workoutService;
    
    @Override
    public void run(String... args) {
        try {
            // Only add test users if the database is empty
            if (userRepository.count() == 0) {
                // Create an admin user
                User admin = new User();
                admin.setEmail("admin@gymflex.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setRegistrationDate(LocalDateTime.now());
                userRepository.save(admin);
                
                // Create a member user
                User member = new User();
                member.setEmail("member@gymflex.com");
                member.setPassword(passwordEncoder.encode("member123"));
                member.setRole("MEMBER");
                member.setFirstName("Member");
                member.setLastName("User");
                member.setRegistrationDate(LocalDateTime.now());
                member.setPhoneNumber("+90 555 123 4567");
                userRepository.save(member);
                
                // Create a second member
                User member2 = new User();
                member2.setEmail("member2@gymflex.com");
                member2.setPassword(passwordEncoder.encode("member123"));
                member2.setRole("MEMBER");
                member2.setFirstName("Jane");
                member2.setLastName("Smith");
                member2.setPhoneNumber("+90 555 987 6543");
                member2.setRegistrationDate(LocalDateTime.now());
                userRepository.save(member2);
                
                // Create a trainer user
                User trainer = new User();
                trainer.setEmail("trainer@gymflex.com");
                trainer.setPassword(passwordEncoder.encode("trainer123"));
                trainer.setRole("TRAINER");
                trainer.setFirstName("Trainer");
                trainer.setLastName("User");
                trainer.setRegistrationDate(LocalDateTime.now());
                userRepository.save(trainer);
                
                createTrainerClientRelationship(trainer, member);
                createTrainerRequest(trainer, member2);
                createTrainerSessions(trainer, member);
                
                // Initialize workout data
                initializeWorkoutData();
                createSampleWorkouts(trainer);
                
                System.out.println("Test users created successfully!");
            } else {
                System.out.println("Database already has users, checking trainer relationships...");
                
                // Check if trainer-client relationship exists
                if (trainerClientRepository.count() == 0) {
                    Optional<User> trainer = userRepository.findByEmail("trainer@gymflex.com");
                    Optional<User> member = userRepository.findByEmail("member@gymflex.com");
                    
                    if (trainer.isPresent() && member.isPresent()) {
                        createTrainerClientRelationship(trainer.get(), member.get());
                    }
                }
                
                // Check if trainer request exists
                if (requestRepository.count() == 0) {
                    Optional<User> trainer = userRepository.findByEmail("trainer@gymflex.com");
                    Optional<User> member2 = userRepository.findByEmail("member2@gymflex.com");
                    
                    if (trainer.isPresent() && member2.isPresent()) {
                        createTrainerRequest(trainer.get(), member2.get());
                    }
                }
                
                // Check if trainer sessions exist
                if (sessionRepository.count() == 0) {
                    Optional<User> trainer = userRepository.findByEmail("trainer@gymflex.com");
                    Optional<User> member = userRepository.findByEmail("member@gymflex.com");
                    
                    if (trainer.isPresent() && member.isPresent()) {
                        createTrainerSessions(trainer.get(), member.get());
                    }
                }
                
                // Check if workout categories and levels exist
                if (categoryRepository.count() == 0 || levelRepository.count() == 0) {
                    initializeWorkoutData();
                }
                
                // Check if sample workouts exist
                if (workoutRepository.count() == 0) {
                    Optional<User> trainer = userRepository.findByEmail("trainer@gymflex.com");
                    if (trainer.isPresent()) {
                        createSampleWorkouts(trainer.get());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error during database initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createTrainerClientRelationship(User trainer, User member) {
        try {
            TrainerClient clientRelationship = new TrainerClient();
            clientRelationship.setTrainer(trainer);
            clientRelationship.setClient(member);
            clientRelationship.setRegistrationDate(LocalDateTime.now().minusDays(10));
            clientRelationship.setRemainingSessions(8);
            trainerClientRepository.save(clientRelationship);
            
            System.out.println("Trainer-client relationship created!");
        } catch (Exception e) {
            System.err.println("Error creating trainer-client relationship: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createTrainerRequest(User trainer, User member) {
        try {
            TrainerRegistrationRequest request = new TrainerRegistrationRequest();
            request.setTrainer(trainer);
            request.setClient(member);
            request.setRequestMessage("I'd like to start strength training sessions with you. I'm available in the evenings.");
            request.setRequestedMeetingDate(LocalDate.now().plusDays(3));
            request.setRequestedMeetingTime(LocalTime.of(17, 30));
            request.setIsModifiedByTrainer(false);
            requestRepository.save(request);
            
            System.out.println("Sample trainer request created!");
        } catch (Exception e) {
            System.err.println("Error creating trainer request: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createTrainerSessions(User trainer, User member) {
        try {
            // Create a session for today
            TrainerSession session1 = new TrainerSession();
            session1.setTrainer(trainer);
            session1.setClient(member);
            session1.setSessionDate(LocalDate.now());
            session1.setSessionTime(LocalTime.of(9, 0));
            session1.setSessionType("Personal Training");
            session1.setNotes("Focus on upper body strength");
            sessionRepository.save(session1);
            
            // Create a session for tomorrow
            TrainerSession session2 = new TrainerSession();
            session2.setTrainer(trainer);
            session2.setClient(member);
            session2.setSessionDate(LocalDate.now().plusDays(1));
            session2.setSessionTime(LocalTime.of(15, 30));
            session2.setSessionType("Yoga Session");
            session2.setNotes("Beginner level");
            sessionRepository.save(session2);
            
            // Create a session for next week
            TrainerSession session3 = new TrainerSession();
            session3.setTrainer(trainer);
            session3.setClient(member);
            session3.setSessionDate(LocalDate.now().plusDays(7));
            session3.setSessionTime(LocalTime.of(11, 0));
            session3.setSessionType("Strength Training");
            session3.setNotes("Focus on leg day");
            sessionRepository.save(session3);
            
            System.out.println("Sample trainer sessions created!");
        } catch (Exception e) {
            System.err.println("Error creating trainer sessions: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void initializeWorkoutData() {
        try {
            workoutService.initializeDefaultCategoriesAndLevels();
            System.out.println("Workout categories and levels initialized!");
        } catch (Exception e) {
            System.err.println("Error initializing workout data: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createSampleWorkouts(User trainer) {
        try {
            WorkoutCategory strengthCategory = categoryRepository.findByName("Strength Training");
            WorkoutCategory cardioCategory = categoryRepository.findByName("Cardio");
            
            WorkoutLevel intermediateLevel = levelRepository.findByName("Intermediate");
            WorkoutLevel advancedLevel = levelRepository.findByName("Advanced");
            
            if (strengthCategory == null || cardioCategory == null || 
                intermediateLevel == null || advancedLevel == null) {
                System.err.println("Missing workout categories or levels, initializing them first");
                initializeWorkoutData();
                
                // Fetch them again after initialization
                strengthCategory = categoryRepository.findByName("Strength Training");
                cardioCategory = categoryRepository.findByName("Cardio");
                intermediateLevel = levelRepository.findByName("Intermediate");
                advancedLevel = levelRepository.findByName("Advanced");
            }
            
            // Create a strength workout
            Workout strengthWorkout = new Workout();
            strengthWorkout.setUser(trainer);
            strengthWorkout.setIsTrainer(true);
            strengthWorkout.setLevel(intermediateLevel);
            strengthWorkout.setCategory(strengthCategory);
            strengthWorkout.setDuration(60);
            strengthWorkout.setName("Full Body Strength");
            strengthWorkout.setDescription("Complete full body workout focusing on major muscle groups");
            strengthWorkout.setCalories(450);
            strengthWorkout.setEquipment("Dumbbells,Barbell,Resistance Bands");
            strengthWorkout.setTargetMuscles("Chest,Back,Legs,Shoulders");
            
            workoutRepository.save(strengthWorkout);
            
            // Add exercises to the strength workout
            List<WorkoutExercise> strengthExercises = Arrays.asList(
                new WorkoutExercise(null, strengthWorkout, "Barbell Squat", 4, "8-12 reps"),
                new WorkoutExercise(null, strengthWorkout, "Bench Press", 4, "8-12 reps"),
                new WorkoutExercise(null, strengthWorkout, "Deadlift", 3, "8-10 reps")
            );
            exerciseRepository.saveAll(strengthExercises);
            
            // Create a cardio workout
            Workout cardioWorkout = new Workout();
            cardioWorkout.setUser(trainer);
            cardioWorkout.setIsTrainer(true);
            cardioWorkout.setLevel(advancedLevel);
            cardioWorkout.setCategory(cardioCategory);
            cardioWorkout.setDuration(45);
            cardioWorkout.setName("HIIT Cardio Blast");
            cardioWorkout.setDescription("High-intensity interval training for maximum calorie burn");
            cardioWorkout.setCalories(600);
            cardioWorkout.setEquipment("Kettlebell,Jump Rope,Yoga Mat");
            cardioWorkout.setTargetMuscles("Core,Legs,Shoulders");
            
            workoutRepository.save(cardioWorkout);
            
            // Add exercises to the cardio workout
            List<WorkoutExercise> cardioExercises = Arrays.asList(
                new WorkoutExercise(null, cardioWorkout, "Burpees", 5, "45 seconds"),
                new WorkoutExercise(null, cardioWorkout, "Mountain Climbers", 5, "45 seconds"),
                new WorkoutExercise(null, cardioWorkout, "Jump Rope", 5, "60 seconds")
            );
            exerciseRepository.saveAll(cardioExercises);
            
            System.out.println("Sample workouts created successfully!");
        } catch (Exception e) {
            System.err.println("Error creating sample workouts: " + e.getMessage());
            e.printStackTrace();
        }
    }
}