package com.gymmanagement.config;

import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.model.TrainerRegistrationRequest;
import com.gymmanagement.model.User;
import com.gymmanagement.repository.TrainerClientRepository;
import com.gymmanagement.repository.TrainerRegistrationRequestRepository;
import com.gymmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
}