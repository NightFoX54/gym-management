package com.gymmanagement.controller;

import com.gymmanagement.model.GeneralPrice;
import com.gymmanagement.repository.GeneralPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class GeneralPriceController {

    @Autowired
    private GeneralPriceRepository generalPriceRepository;
    
    // Get all general prices
    @GetMapping("/general-prices")
    public List<GeneralPrice> getAllGeneralPrices() {
        return generalPriceRepository.findAll();
    }
    
    // Get a specific general price by ID
    @GetMapping("/general-prices/{id}")
    public ResponseEntity<GeneralPrice> getGeneralPriceById(@PathVariable Integer id) {
        Optional<GeneralPrice> optionalPrice = generalPriceRepository.findById(id);
        
        if (optionalPrice.isPresent()) {
            return ResponseEntity.ok(optionalPrice.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 