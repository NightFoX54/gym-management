package com.gymmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "market_product_sales")
public class MarketProductSale {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private MarketSalesInvoice invoice;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private MarketProduct product;
    
    @Column(nullable = false)
    private Integer quantity;
} 