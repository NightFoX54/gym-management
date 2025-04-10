package com.gymmanagement.service;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MarketService {

    @Autowired
    private MarketProductRepository productRepository;

    @Autowired
    private MarketCategoryRepository categoryRepository;
    
    @Autowired
    private MarketSalesInvoiceRepository salesInvoiceRepository;
    
    @Autowired
    private MarketProductSaleRepository productSaleRepository;

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
    
    @Transactional
    public void deleteProduct(Long id) {
        // First check if product exists
        MarketProduct product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Check if the product has been sold using repository directly
        boolean hasBeenSold = productSaleRepository.existsByProductId(id);
        
        if (hasBeenSold) {
            throw new RuntimeException("Cannot delete product with ID " + id + " because it has sales records associated with it.");
        }
        
        productRepository.deleteById(id);
    }
    
    public MarketProduct getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    @Transactional
    public MarketSalesInvoice processPurchase(Long userId, List<Map<String, Object>> cartItems, BigDecimal totalPrice) {
        // Create new invoice
        MarketSalesInvoice invoice = new MarketSalesInvoice();
        invoice.setUserId(userId);
        invoice.setTotalItems(cartItems.stream().mapToInt(item -> (Integer) item.get("quantity")).sum());
        invoice.setTotalPrice(totalPrice);
        invoice.setSaleDate(LocalDateTime.now());
        
        // Generate unique order number (format: GYM-yyyyMMdd-XXXX)
        String orderPrefix = "GYM-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String orderNo = generateUniqueOrderNumber(orderPrefix);
        invoice.setOrderNo(orderNo);
        
        // Save invoice to get ID
        MarketSalesInvoice savedInvoice = salesInvoiceRepository.save(invoice);
        
        // Create product sales records
        List<MarketProductSale> productSales = new ArrayList<>();
        
        for (Map<String, Object> item : cartItems) {
            Long productId = Long.valueOf(item.get("id").toString());
            Integer quantity = (Integer) item.get("quantity");
            
            // Get product
            MarketProduct product = getProductById(productId);
            
            // Check stock
            if (product.getStock() < quantity) {
                throw new RuntimeException("Not enough stock for product: " + product.getProductName());
            }
            
            // Update stock
            product.setStock(product.getStock() - quantity);
            productRepository.save(product);
            
            // Create sale record
            MarketProductSale sale = new MarketProductSale();
            sale.setInvoice(savedInvoice);
            sale.setProduct(product);
            sale.setQuantity(quantity);
            
            productSales.add(sale);
        }
        
        // Save all product sales
        productSaleRepository.saveAll(productSales);
        
        // Set product sales to invoice
        savedInvoice.setProductSales(productSales);
        
        return savedInvoice;
    }
    
    private String generateUniqueOrderNumber(String prefix) {
        // Get the count of orders created today
        long count = salesInvoiceRepository.countByOrderNoStartingWith(prefix) + 1;
        
        // Format as 4-digit number with leading zeros
        String suffix = String.format("%04d", count);
        
        return prefix + "-" + suffix;
    }
    
    public List<MarketSalesInvoice> getUserPurchaseHistory(Long userId) {
        return salesInvoiceRepository.findByUserIdOrderBySaleDateDesc(userId);
    }
} 