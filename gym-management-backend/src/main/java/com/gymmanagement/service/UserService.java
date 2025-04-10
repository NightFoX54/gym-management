package com.gymmanagement.service;

import com.gymmanagement.dto.SignupRequest;
import com.gymmanagement.dto.SignupResponse;
import com.gymmanagement.model.Membership;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.model.User;
import com.gymmanagement.model.PaymentMethod;
import com.gymmanagement.model.PasswordResetToken;
import com.gymmanagement.repository.MembershipPlanRepository;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.PaymentMethodRepository;
import com.gymmanagement.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MembershipPlanRepository membershipPlanRepository;
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.baseUrl}")
    private String baseUrl;
    
    @Transactional
    public SignupResponse registerUser(SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return SignupResponse.builder()
                    .success(false)
                    .message("Email is already in use")
                    .build();
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setRole("MEMBER"); // Default role for signup
        user.setRegistrationDate(LocalDateTime.now());
        user.setProfilePhotoPath("/uploads/images/default-avatar.jpg"); // Set default profile photo
        
        User savedUser = userRepository.save(user);
        
        // Create membership if plan ID is provided
        if (signupRequest.getPlanId() != null) {
            MembershipPlan plan = membershipPlanRepository.findById(signupRequest.getPlanId())
                    .orElseThrow(() -> new RuntimeException("Membership plan not found"));
            
            LocalDate startDate = signupRequest.getStartDate() != null ? 
                    signupRequest.getStartDate() : LocalDate.now();
            
            int durationMonths = signupRequest.getDurationMonths() != null ? 
                    signupRequest.getDurationMonths() : 1;
            
            LocalDate endDate = startDate.plusMonths(durationMonths);
            
            Membership membership = new Membership();
            membership.setUser(savedUser);
            membership.setPlan(plan);
            membership.setStartDate(startDate);
            membership.setEndDate(endDate);
            
            // Initialize discount amount to zero by default
            membership.setDiscountAmount(BigDecimal.ZERO);
            
            // Calculate discount based on duration
            if(durationMonths == 3){
                membership.setDiscountAmount(plan.getPlanPrice().multiply(BigDecimal.valueOf(0.10)).multiply(BigDecimal.valueOf(durationMonths)));
            }
            else if(durationMonths == 6){
                membership.setDiscountAmount(plan.getPlanPrice().multiply(BigDecimal.valueOf(0.20)).multiply(BigDecimal.valueOf(durationMonths)));
            }
            else if(durationMonths == 12){
                membership.setDiscountAmount(plan.getPlanPrice().multiply(BigDecimal.valueOf(0.28)).multiply(BigDecimal.valueOf(durationMonths)));
            }
            // For monthly (durationMonths == 1), discount remains zero
            
            // Calculate paid amount after discount
            BigDecimal totalPrice = plan.getPlanPrice().multiply(BigDecimal.valueOf(durationMonths));
            membership.setPaidAmount(totalPrice.subtract(membership.getDiscountAmount()));
            membership.setIsFrozen(false);
            
            Membership savedMembership = membershipRepository.save(membership);
            
            PaymentMethod paymentMethod = new PaymentMethod();
            paymentMethod.setUserId(savedUser.getId());
            paymentMethod.setCardHolderName(signupRequest.getCardHolderName());
            paymentMethod.setCardNumber(signupRequest.getCardNumber());
            paymentMethod.setExpiryDate(signupRequest.getExpiryDate());
            paymentMethod.setCvv(signupRequest.getCvv());
            paymentMethodRepository.save(paymentMethod);
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            
            return SignupResponse.builder()
                    .userId(savedUser.getId())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole())
                    .success(true)
                    .message("User registered successfully with membership")
                    .membershipId(savedMembership.getId())
                    .membershipPlan(plan.getPlanName())
                    .membershipEndDate(endDate.format(formatter))
                    .build();
        }
        
        return SignupResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .success(true)
                .message("User registered successfully")
                .build();
    }

    /**
     * Generates a password reset token and sends a reset email
     */
    @Transactional
    public boolean requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            // We don't want to reveal if an email exists in the system
            return false;
        }
        
        User user = userOpt.get();
        
        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        
        // Create a new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Token valid for 24 hours
        
        passwordResetTokenRepository.save(resetToken);
        
        // Send email
        try {
            sendPasswordResetEmail(user, token);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Validates a token and updates the user's password
     */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        
        if (!tokenOpt.isPresent() || tokenOpt.get().isExpired()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        User user = resetToken.getUser();
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Delete the used token
        passwordResetTokenRepository.delete(resetToken);
        
        return true;
    }

    private void sendPasswordResetEmail(User user, String token) {
        String resetUrl = baseUrl + "/reset-password?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Password Reset Request");
        message.setText("Dear " + user.getFirstName() + ",\n\n" +
                "You requested to reset your password. Click the link below to set a new password:\n\n" +
                resetUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Gym Management Team");
        
        try {
            System.out.println("Attempting to send email to: " + user.getEmail());
            mailSender.send(message);
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
            // Re-throw the exception to be handled by the caller
            throw e;
        }
    }

    /**
     * Validates if a reset token is valid and not expired
     */
    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        return tokenOpt.isPresent() && !tokenOpt.get().isExpired();
    }
} 
