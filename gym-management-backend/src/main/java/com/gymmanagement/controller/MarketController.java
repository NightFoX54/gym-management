package com.gymmanagement.controller;

import com.gymmanagement.dto.CheckoutRequest;
import com.gymmanagement.model.MarketProduct;
import com.gymmanagement.model.MarketCategory;
import com.gymmanagement.model.MarketSalesInvoice;
import com.gymmanagement.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.HttpStatus;

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
    
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> checkout(@RequestBody CheckoutRequest checkoutRequest) {
        try {
            MarketSalesInvoice invoice = marketService.processPurchase(
                checkoutRequest.getUserId(),
                checkoutRequest.getCartItems(),
                checkoutRequest.getTotalPrice()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order processed successfully");
            response.put("invoiceId", invoice.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    @GetMapping("/purchases/{userId}")
    public ResponseEntity<List<MarketSalesInvoice>> getUserPurchases(@PathVariable Long userId) {
        return ResponseEntity.ok(marketService.getUserPurchaseHistory(userId));
    }
} 