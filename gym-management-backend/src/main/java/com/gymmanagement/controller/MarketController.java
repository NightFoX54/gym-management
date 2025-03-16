package com.gymmanagement.controller;

import com.gymmanagement.model.MarketProduct;
import com.gymmanagement.model.MarketCategory;
import com.gymmanagement.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*")
public class MarketController {

    @Autowired
    private MarketService marketService;

    @GetMapping("/products")
    public ResponseEntity<List<MarketProduct>> getAllProducts() {
        return ResponseEntity.ok(marketService.getAllProducts());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MarketCategory>> getAllCategories() {
        return ResponseEntity.ok(marketService.getAllCategories());
    }

    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<MarketProduct>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(marketService.getProductsByCategory(categoryId));
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<MarketProduct>> searchProducts(@RequestParam String query) {
        return ResponseEntity.ok(marketService.searchProducts(query));
    }
    
    @PostMapping("/products")
    public ResponseEntity<MarketProduct> createProduct(@RequestBody MarketProduct product) {
        return ResponseEntity.ok(marketService.saveProduct(product));
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<MarketProduct> updateProduct(
            @PathVariable Long id, 
            @RequestBody MarketProduct product) {
        product.setId(id); // Ensure the ID is set correctly
        return ResponseEntity.ok(marketService.saveProduct(product));
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        marketService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
} 