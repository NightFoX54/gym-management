package com.gymmanagement.service;

import com.gymmanagement.model.MarketProduct;
import com.gymmanagement.model.MarketCategory;
import com.gymmanagement.repository.MarketProductRepository;
import com.gymmanagement.repository.MarketCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketService {

    @Autowired
    private MarketProductRepository productRepository;

    @Autowired
    private MarketCategoryRepository categoryRepository;

    public List<MarketProduct> getAllProducts() {
        return productRepository.findAll();
    }

    public List<MarketCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<MarketProduct> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<MarketProduct> searchProducts(String searchText) {
        return productRepository.findByProductNameContainingIgnoreCase(searchText);
    }
    
    public MarketProduct saveProduct(MarketProduct product) {
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public MarketProduct getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
} 