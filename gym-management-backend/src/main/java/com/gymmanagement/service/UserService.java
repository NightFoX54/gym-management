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
import org.springframework.mail.javamail.MimeMessageHelper;
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

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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
        try {
            String resetUrl = baseUrl + "/reset-password?token=" + token;
            
            // Create a MimeMessage instead of SimpleMailMessage to support HTML
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(user.getEmail());
            helper.setSubject("Password Reset Request");
            
            // Enhanced HTML email template with improved styling
            String htmlContent = "<!DOCTYPE html>\n" +
                    "<html>\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Password Reset</title>\n" +
                    "    <style>\n" +
                    "        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');\n" +
                    "        body {\n" +
                    "            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n" +
                    "            line-height: 1.7;\n" +
                    "            color: #333;\n" +
                    "            margin: 0;\n" +
                    "            padding: 0;\n" +
                    "            background-color: #f4f7fa;\n" +
                    "        }\n" +
                    "        .container {\n" +
                    "            max-width: 600px;\n" +
                    "            margin: 40px auto;\n" +
                    "            background-color: #ffffff;\n" +
                    "            border-radius: 12px;\n" +
                    "            overflow: hidden;\n" +
                    "            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);\n" +
                    "        }\n" +
                    "        .header {\n" +
                    "            background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);\n" +
                    "            color: white;\n" +
                    "            padding: 30px;\n" +
                    "            text-align: center;\n" +
                    "            position: relative;\n" +
                    "        }\n" +
                    "        .header:after {\n" +
                    "            content: '';\n" +
                    "            position: absolute;\n" +
                    "            bottom: 0;\n" +
                    "            left: 0;\n" +
                    "            right: 0;\n" +
                    "            height: 8px;\n" +
                    "            background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%);\n" +
                    "            background-size: 16px 8px;\n" +
                    "        }\n" +
                    "        .header h1 {\n" +
                    "            margin: 0;\n" +
                    "            font-size: 26px;\n" +
                    "            font-weight: 700;\n" +
                    "            letter-spacing: 0.5px;\n" +
                    "            text-shadow: 0 2px 4px rgba(0,0,0,0.1);\n" +
                    "        }\n" +
                    "        .logo-area {\n" +
                    "            display: flex;\n" +
                    "            align-items: center;\n" +
                    "            justify-content: center;\n" +
                    "            margin-bottom: 10px;\n" +
                    "        }\n" +
                    "        .logo-placeholder {\n" +
                    "            width: 40px;\n" +
                    "            height: 40px;\n" +
                    "            background-color: white;\n" +
                    "            border-radius: 50%;\n" +
                    "            display: inline-flex;\n" +
                    "            align-items: center;\n" +
                    "            justify-content: center;\n" +
                    "            margin-right: 10px;\n" +
                    "            font-weight: bold;\n" +
                    "            color: #ff4757;\n" +
                    "            font-size: 22px;\n" +
                    "            box-shadow: 0 3px 8px rgba(0,0,0,0.15);\n" +
                    "        }\n" +
                    "        .content {\n" +
                    "            padding: 40px 30px;\n" +
                    "        }\n" +
                    "        .greeting {\n" +
                    "            font-size: 20px;\n" +
                    "            font-weight: 600;\n" +
                    "            margin-bottom: 18px;\n" +
                    "            color: #2c3e50;\n" +
                    "        }\n" +
                    "        .message {\n" +
                    "            margin-bottom: 25px;\n" +
                    "            font-size: 16px;\n" +
                    "            color: #4a5568;\n" +
                    "        }\n" +
                    "        .button-container {\n" +
                    "            text-align: center;\n" +
                    "            margin: 35px 0;\n" +
                    "        }\n" +
                    "        .button {\n" +
                    "            display: inline-block;\n" +
                    "            padding: 14px 28px;\n" +
                    "            background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);\n" +
                    "            color: white;\n" +
                    "            text-align: center;\n" +
                    "            text-decoration: none;\n" +
                    "            border-radius: 6px;\n" +
                    "            font-weight: 600;\n" +
                    "            font-size: 16px;\n" +
                    "            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);\n" +
                    "            transition: transform 0.3s, box-shadow 0.3s;\n" +
                    "            letter-spacing: 0.5px;\n" +
                    "        }\n" +
                    "        .button:hover {\n" +
                    "            transform: translateY(-3px);\n" +
                    "            box-shadow: 0 8px 15px rgba(255, 71, 87, 0.5);\n" +
                    "        }\n" +
                    "        .divider {\n" +
                    "            height: 1px;\n" +
                    "            background-color: #e2e8f0;\n" +
                    "            margin: 30px 0;\n" +
                    "        }\n" +
                    "        .note {\n" +
                    "            font-size: 14px;\n" +
                    "            color: #718096;\n" +
                    "            margin-top: 25px;\n" +
                    "            background-color: #f8fafc;\n" +
                    "            padding: 15px;\n" +
                    "            border-radius: 6px;\n" +
                    "            border-left: 4px solid #cbd5e0;\n" +
                    "        }\n" +
                    "        .link-text {\n" +
                    "            word-break: break-all;\n" +
                    "            font-size: 14px;\n" +
                    "            color: #4a5568;\n" +
                    "            background-color: #f8fafc;\n" +
                    "            padding: 12px;\n" +
                    "            border-radius: 4px;\n" +
                    "            border: 1px solid #e2e8f0;\n" +
                    "        }\n" +
                    "        .footer {\n" +
                    "            background-color: #f8fafc;\n" +
                    "            padding: 25px 30px;\n" +
                    "            text-align: center;\n" +
                    "            font-size: 14px;\n" +
                    "            color: #718096;\n" +
                    "            border-top: 1px solid #e2e8f0;\n" +
                    "        }\n" +
                    "        .social-links {\n" +
                    "            margin-top: 15px;\n" +
                    "        }\n" +
                    "        .social-icon {\n" +
                    "            display: inline-block;\n" +
                    "            width: 32px;\n" +
                    "            height: 32px;\n" +
                    "            background-color: #e2e8f0;\n" +
                    "            border-radius: 50%;\n" +
                    "            margin: 0 5px;\n" +
                    "            text-align: center;\n" +
                    "            line-height: 32px;\n" +
                    "            font-size: 16px;\n" +
                    "            color: #4a5568;\n" +
                    "            text-decoration: none;\n" +
                    "        }\n" +
                    "        .social-icon:hover {\n" +
                    "            background-color: #cbd5e0;\n" +
                    "        }\n" +
                    "        .highlight {\n" +
                    "            color: #ff4757;\n" +
                    "            font-weight: 600;\n" +
                    "        }\n" +
                    "        .emoji {\n" +
                    "            font-size: 18px;\n" +
                    "            margin-right: 5px;\n" +
                    "        }\n" +
                    "        @media only screen and (max-width: 600px) {\n" +
                    "            .container {\n" +
                    "                margin: 20px auto;\n" +
                    "                width: 100%;\n" +
                    "                border-radius: 0;\n" +
                    "            }\n" +
                    "            .content, .header {\n" +
                    "                padding: 25px 20px;\n" +
                    "            }\n" +
                    "            .button {\n" +
                    "                display: block;\n" +
                    "                width: 100%;\n" +
                    "            }\n" +
                    "        }\n" +
                    "    </style>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "    <div class=\"container\">\n" +
                    "        <div class=\"header\">\n" +
                    "            <div class=\"logo-area\">\n" +
                    "                <div class=\"logo-placeholder\">G</div>\n" +
                    "                <h1>Gym Management</h1>\n" +
                    "            </div>\n" +
                    "            <div style=\"font-size: 15px; margin-top: 5px; opacity: 0.9;\">Your Fitness Partner</div>\n" +
                    "        </div>\n" +
                    "        <div class=\"content\">\n" +
                    "            <p class=\"greeting\"><span class=\"emoji\">👋</span> Hello, " + user.getFirstName() + "!</p>\n" +
                    "            <p class=\"message\">We received a request to reset your password for your <span class=\"highlight\">Gym Management</span> account. Don't worry, we're here to help you regain access.</p>\n" +
                    "            <div class=\"button-container\">\n" +
                    "                <a href=\"" + resetUrl + "\" class=\"button\">Reset Your Password</a>\n" +
                    "            </div>\n" +
                    "            <p class=\"message\">This password reset link will expire in <span class=\"highlight\">24 hours</span>. If you didn't request this change, you can safely ignore this email.</p>\n" +
                    "            <div class=\"divider\"></div>\n" +
                    "            <p class=\"message\" style=\"font-size: 15px;\">If the button doesn't work, copy and paste this link into your browser:</p>\n" +
                    "            <p class=\"link-text\">" + resetUrl + "</p>\n" +
                    "            <div class=\"note\">\n" +
                    "                <strong>Security Tip:</strong> Never share your password with anyone. We will never ask for your password in an email or phone call.\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "        <div class=\"footer\">\n" +
                    "            <p>&copy; " + java.time.Year.now().getValue() + " Gym Management | All rights reserved</p>\n" +
                    "            <p>Health · Fitness · Wellness</p>\n" +
                    "            <div class=\"social-links\">\n" +
                    "                <a href=\"#\" class=\"social-icon\">f</a>\n" +
                    "                <a href=\"#\" class=\"social-icon\">in</a>\n" +
                    "                <a href=\"#\" class=\"social-icon\">ig</a>\n" +
                    "                <a href=\"#\" class=\"social-icon\">t</a>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>\n" +
                    "</body>\n" +
                    "</html>";
            
            helper.setText(htmlContent, true); // true indicates HTML content
            
            System.out.println("Attempting to send email to: " + user.getEmail());
            mailSender.send(mimeMessage);
            System.out.println("Email sent successfully");
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    /**
     * Validates if a reset token is valid and not expired
     */
    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        return tokenOpt.isPresent() && !tokenOpt.get().isExpired();
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }
} 
