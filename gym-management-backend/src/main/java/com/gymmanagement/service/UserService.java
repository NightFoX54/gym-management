package com.gymmanagement.service;

import com.gymmanagement.dto.SignupRequest;
import com.gymmanagement.dto.SignupResponse;
import com.gymmanagement.model.Membership;
import com.gymmanagement.model.MembershipPlan;
import com.gymmanagement.model.User;
import com.gymmanagement.model.PaymentMethod;
import com.gymmanagement.repository.MembershipPlanRepository;
import com.gymmanagement.repository.MembershipRepository;
import com.gymmanagement.repository.UserRepository;
import com.gymmanagement.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.gymmanagement.dto.CustomerDTO;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.gymmanagement.dto.EmployeeDTO;
import java.util.Arrays;
import com.gymmanagement.model.EmployeeInfo;
import com.gymmanagement.repository.EmployeeInfoRepository;
import com.gymmanagement.dto.ShiftEntryDTO;
import com.gymmanagement.model.ShiftEntry;
import com.gymmanagement.repository.ShiftEntryRepository;

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
    private EmployeeInfoRepository employeeInfoRepository;
    
    @Autowired
    private ShiftEntryRepository shiftEntryRepository;
    
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

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        List<User> members = userRepository.findByRole("MEMBER");
        
        return members.stream().map(user -> {
            CustomerDTO dto = new CustomerDTO();
            dto.setId(user.getId());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setEmail(user.getEmail());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setRegistrationDate(user.getRegistrationDate());
            
            Optional<Membership> membershipOpt = membershipRepository.findByUser(user);
            if (membershipOpt.isPresent()) {
                Membership membership = membershipOpt.get();
                dto.setMembershipPlanName(membership.getPlan().getPlanName());
                dto.setMembershipStartDate(membership.getStartDate());
                dto.setMembershipEndDate(membership.getEndDate());
                dto.setIsMembershipFrozen(membership.getIsFrozen());
                // Determine if membership is active based on end date and frozen status
                dto.setIsMembershipActive(!membership.getIsFrozen() && membership.getEndDate().isAfter(LocalDate.now()));
            } else {
                // Handle cases where a member might not have a membership record
                // Or set default/null values
                dto.setMembershipPlanName("N/A");
                dto.setIsMembershipActive(false);
                dto.setIsMembershipFrozen(false);
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        List<String> employeeRoles = Arrays.asList("TRAINER", "STAFF");
        List<User> employees = userRepository.findByRoleIn(employeeRoles);
        
        return employees.stream().map(user -> {
            EmployeeDTO dto = new EmployeeDTO();
            // Map basic user info
            dto.setId(user.getId());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setEmail(user.getEmail());
            dto.setPhoneNumber(user.getPhoneNumber());
            dto.setRole(user.getRole());
            dto.setRegistrationDate(user.getRegistrationDate());
            
            // Map EmployeeInfo
            Optional<EmployeeInfo> infoOpt = employeeInfoRepository.findByUser(user);
            if (infoOpt.isPresent()) {
                EmployeeInfo info = infoOpt.get();
                dto.setSalary(info.getSalary());
                dto.setWeeklyHours(info.getWeeklyHours());
            } else {
                dto.setSalary(null);
                dto.setWeeklyHours(null);
            }
            
            // Map ShiftEntries
            List<ShiftEntry> shifts = shiftEntryRepository.findByUserOrderByDayOfWeekAscStartTimeAsc(user);
            List<ShiftEntryDTO> shiftDTOs = shifts.stream().map(shift -> {
                ShiftEntryDTO shiftDto = new ShiftEntryDTO();
                shiftDto.setId(shift.getId());
                shiftDto.setDayOfWeek(shift.getDayOfWeek());
                shiftDto.setStartTime(shift.getStartTime());
                shiftDto.setEndTime(shift.getEndTime());
                shiftDto.setTask(shift.getTask());
                return shiftDto;
            }).collect(Collectors.toList());
            dto.setShiftEntries(shiftDTOs);
            
            return dto;
        }).collect(Collectors.toList());
    }
} 
