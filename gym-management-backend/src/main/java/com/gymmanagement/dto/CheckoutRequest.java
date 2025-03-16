package com.gymmanagement.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class CheckoutRequest {
    private Long userId;
    private List<Map<String, Object>> cartItems;
    private BigDecimal totalPrice;
} 