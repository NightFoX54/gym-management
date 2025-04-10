package com.gymmanagement.controller;

import com.gymmanagement.model.PtSessionBuy;
import com.gymmanagement.model.TrainerClient;
import com.gymmanagement.repository.PtSessionBuyRepository;
import com.gymmanagement.repository.TrainerClientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pt-sessions")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class PtSessionBuyController {

    @Autowired
    private TrainerClientRepository trainerClientRepository;
    
    @Autowired
    private PtSessionBuyRepository ptSessionBuyRepository;
    
    @PostMapping("/buy")
    @Transactional
    public ResponseEntity<?> buyPtSessions(@RequestBody Map<String, Object> requestData) {
        try {
            Long trainerClientId = Long.parseLong(requestData.get("trainerClientId").toString());
            Integer sessionAmount = Integer.parseInt(requestData.get("sessionAmount").toString());
            
            // Get trainer-client relationship
            TrainerClient trainerClient = trainerClientRepository.findById(trainerClientId)
                .orElseThrow(() -> new RuntimeException("Trainer-client relationship not found"));
            
            // Calculate price and discount
            BigDecimal pricePerSession = new BigDecimal("200.00");
            BigDecimal totalPrice = pricePerSession.multiply(new BigDecimal(sessionAmount));
            BigDecimal discount = BigDecimal.ZERO;
            
            // Apply discount based on amount
            if (sessionAmount >= 5 && sessionAmount < 10) {
                discount = totalPrice.multiply(new BigDecimal("0.10")); // 10% discount
            } else if (sessionAmount >= 10 && sessionAmount < 20) {
                discount = totalPrice.multiply(new BigDecimal("0.15")); // 15% discount
            } else if (sessionAmount >= 20) {
                discount = totalPrice.multiply(new BigDecimal("0.20")); // 20% discount
            }
            
            BigDecimal finalPrice = totalPrice.subtract(discount);
            
            // Create new purchase record
            PtSessionBuy ptSessionBuy = new PtSessionBuy();
            ptSessionBuy.setClient(trainerClient);
            ptSessionBuy.setAmountOfSessions(sessionAmount);
            ptSessionBuy.setTotalPrice(finalPrice);
            ptSessionBuy.setPurchaseDate(LocalDateTime.now());
            
            // Save the purchase
            PtSessionBuy savedPurchase = ptSessionBuyRepository.save(ptSessionBuy);
            
            // Update remaining sessions
            int currentRemaining = trainerClient.getRemainingSessions();
            trainerClient.setRemainingSessions(currentRemaining + sessionAmount);
            trainerClientRepository.save(trainerClient);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedPurchase.getId());
            response.put("originalPrice", totalPrice);
            response.put("discount", discount);
            response.put("finalPrice", finalPrice);
            response.put("sessionAmount", sessionAmount);
            response.put("purchaseDate", savedPurchase.getPurchaseDate());
            response.put("remainingSessions", trainerClient.getRemainingSessions());
            response.put("message", "Sessions purchased successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to purchase sessions: " + e.getMessage()));
        }
    }
} 