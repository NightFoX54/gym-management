package com.gymmanagement.config;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.logging.Logger;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger logger = Logger.getLogger(DatabaseInitializer.class.getName());

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private TrainerSessionRepository trainerSessionRepository;
    
    @Autowired
    private TrainerSettingsRepository trainerSettingsRepository;
    
    @Autowired
    private TrainerRegistrationRequestRepository registrationRequestRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Clear existing data from trainer tables to avoid duplicates
            logger.info("Initializing database with trainer data...");
            
            // Create admin user if not exists
            User admin = null;
            if (userRepository.findByEmail("admin@gymflex.com").isEmpty()) {
                admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@gymflex.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setRegistrationDate(LocalDateTime.now());
                admin = userRepository.save(admin);
                logger.info("Admin user created: " + admin.getEmail());
            } else {
                admin = userRepository.findByEmail("admin@gymflex.com").get();
                logger.info("Admin user already exists: " + admin.getEmail());
            }
            
            // Create trainer users if not exists
            User trainer1 = createTrainerIfNotExists("trainer@gymflex.com", "Enes Trainer");
            User trainer2 = createTrainerIfNotExists("trainer2@gymflex.com", "Ayşe Instructor");
            
            logger.info("Trainer 1 created/loaded with ID: " + trainer1.getId());
            logger.info("Trainer 2 created/loaded with ID: " + trainer2.getId());
            
            // Create client users if not exist
            User client1 = createClientIfNotExists("client1@example.com", "Faruk Yılmaz");
            User client2 = createClientIfNotExists("client2@example.com", "Mahmut Mahmutoğlu");
            User client3 = createClientIfNotExists("client3@example.com", "Edin Dzeko");
            User client4 = createClientIfNotExists("client4@example.com", "Mauro Icardi");
            User client5 = createClientIfNotExists("client5@example.com", "Lionel Messi");
            User client6 = createClientIfNotExists("client6@example.com", "Cristiano Ronaldo");
            User client7 = createClientIfNotExists("client7@example.com", "Necip Uysal");
            User client8 = createClientIfNotExists("client8@example.com", "Mike Tyson");
            User client9 = createClientIfNotExists("client9@example.com", "Bruce Lee");
            
            // Create trainer settings if not exist
            createTrainerSettingsIfNotExists(trainer1, 
                "Certified personal trainer with 5 years of experience specializing in weight loss and strength training. Committed to helping clients achieve their fitness goals through personalized programs.", 
                "Weight Training, HIIT, Nutrition");
            
            createTrainerSettingsIfNotExists(trainer2, 
                "Yoga instructor and flexibility coach with 8 years of experience. Focused on holistic approaches to fitness including mindfulness and proper form.", 
                "Yoga, Pilates, Flexibility Training");
            
            // Create trainer clients if not exist
            createTrainerClientIfNotExists(trainer1, client1, 10);
            createTrainerClientIfNotExists(trainer1, client2, 5);
            createTrainerClientIfNotExists(trainer1, client3, 8);
            createTrainerClientIfNotExists(trainer2, client4, 12);
            createTrainerClientIfNotExists(trainer2, client5, 6);
            
            // Create trainer sessions if not exist
            createTrainerSessionIfNotExists(trainer1, client1, LocalDate.now().plusDays(2), LocalTime.of(10, 0));
            createTrainerSessionIfNotExists(trainer1, client2, LocalDate.now().plusDays(2), LocalTime.of(11, 30));
            createTrainerSessionIfNotExists(trainer1, client3, LocalDate.now().plusDays(3), LocalTime.of(14, 0));
            createTrainerSessionIfNotExists(trainer1, client1, LocalDate.now().plusDays(4), LocalTime.of(10, 0));
            createTrainerSessionIfNotExists(trainer2, client4, LocalDate.now().plusDays(2), LocalTime.of(9, 0));
            createTrainerSessionIfNotExists(trainer2, client5, LocalDate.now().plusDays(3), LocalTime.of(13, 0));
            
            // Create registration requests if not exist
            createRegistrationRequestIfNotExists(trainer1, client6, 
                "I would like to start personal training focusing on weight loss.", 
                LocalDate.now().plusDays(7), LocalTime.of(10, 0), false);
            
            createRegistrationRequestIfNotExists(trainer1, client7, 
                "Need help with strength training program.", 
                LocalDate.now().plusDays(9), LocalTime.of(14, 0), false);
            
            createRegistrationRequestIfNotExists(trainer2, client8, 
                "Interested in yoga and flexibility training.", 
                LocalDate.now().plusDays(8), LocalTime.of(9, 30), true);
            
            logger.info("Sample trainer data created successfully!");
            
            // Log counts to verify data was inserted
            logger.info("User count: " + userRepository.count());
            logger.info("Trainer client count: " + trainerClientRepository.count());
            logger.info("Trainer session count: " + trainerSessionRepository.count());
            logger.info("Trainer settings count: " + trainerSettingsRepository.count());
            logger.info("Registration request count: " + registrationRequestRepository.count());
            
        } catch (Exception e) {
            logger.severe("Error initializing database: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private User createClientIfNotExists(String email, String name) {
        try {
            Optional<User> existingUser = userRepository.findByEmail(email);
            
            if (existingUser.isPresent()) {
                logger.info("Client already exists: " + email);
                return existingUser.get();
            } else {
                User client = new User();
                client.setName(name);
                client.setEmail(email);
                client.setPassword(passwordEncoder.encode("client123"));
                client.setPhoneNumber("+90 5" + (int)(Math.random() * 100) + " " + (int)(Math.random() * 1000000));
                client.setRole("CLIENT");
                client.setRegistrationDate(LocalDateTime.now());
                client = userRepository.save(client);
                logger.info("Created new client: " + email + " with ID: " + client.getId());
                return client;
            }
        } catch (Exception e) {
            logger.severe("Error creating client: " + e.getMessage());
            throw e;
        }
    }
    
    private User createTrainerIfNotExists(String email, String name) {
        try {
            Optional<User> existingUser = userRepository.findByEmail(email);
            
            if (existingUser.isPresent()) {
                logger.info("Trainer already exists: " + email);
                return existingUser.get();
            } else {
                User trainer = new User();
                trainer.setName(name);
                trainer.setEmail(email);
                trainer.setPassword(passwordEncoder.encode("trainer123"));
                trainer.setPhoneNumber("+90 5" + (int)(Math.random() * 100) + " " + (int)(Math.random() * 1000000));
                trainer.setRole("TRAINER");
                trainer.setRegistrationDate(LocalDateTime.now());
                trainer = userRepository.save(trainer);
                logger.info("Created new trainer: " + email + " with ID: " + trainer.getId());
                return trainer;
            }
        } catch (Exception e) {
            logger.severe("Error creating trainer: " + e.getMessage());
            throw e;
        }
    }
    
    private void createTrainerSettingsIfNotExists(User trainer, String bio, String specialization) {
        try {
            if (trainerSettingsRepository.findByTrainer(trainer).isEmpty()) {
                TrainerSettings settings = new TrainerSettings();
                settings.setTrainer(trainer);
                settings.setBio(bio);
                settings.setSpecialization(specialization);
                settings.setNewClientNotifications(true);
                settings.setProgressUpdateNotifications(true);
                settings.setMobileNotifications(true);
                settings.setDesktopNotifications(true);
                TrainerSettings saved = trainerSettingsRepository.save(settings);
                logger.info("Created trainer settings for trainer ID: " + trainer.getId() + " with settings ID: " + saved.getId());
            } else {
                logger.info("Trainer settings already exist for trainer ID: " + trainer.getId());
            }
        } catch (Exception e) {
            logger.severe("Error creating trainer settings: " + e.getMessage());
            throw e;
        }
    }
    
    private void createTrainerClientIfNotExists(User trainer, User client, int remainingSessions) {
        try {
            if (!trainerClientRepository.existsByTrainerAndClient(trainer, client)) {