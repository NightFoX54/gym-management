package com.gymmanagement.controller;

import com.gymmanagement.model.*;
import com.gymmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/financial")
public class FinancialController {

    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Autowired
    private MembershipRenewalRepository membershipRenewalRepository;
    
    @Autowired
    private MarketSalesInvoiceRepository marketSalesInvoiceRepository;
    
    @Autowired
    private PtSessionBuyRepository ptSessionBuyRepository;
    
    @Autowired
    private GroupClassesSaleRepository groupClassesSaleRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getFinancialDashboard() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Get current date and calculate date ranges
            LocalDate today = LocalDate.now();
            LocalDate weekStart = today.minusDays(7);
            LocalDate monthStart = today.minusDays(30);
            
            // Get expense categories
            List<ExpenseCategory> categories = expenseCategoryRepository.findAll();
            
            // Get expenses
            List<Expense> allExpenses = expenseRepository.findByOrderByDateDesc();
            
            // Process expenses
            Map<String, Object> expenses = processExpenses(allExpenses, categories, today, weekStart, monthStart);
            response.put("expenses", expenses);
            
            // Process incomes
            Map<String, Object> incomes = processIncomes(today, weekStart, monthStart);
            response.put("incomes", incomes);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    private Map<String, Object> processExpenses(List<Expense> allExpenses, List<ExpenseCategory> categories, 
                                                LocalDate today, LocalDate weekStart, LocalDate monthStart) {
        Map<String, Object> result = new HashMap<>();
        
        // Group expenses by day, week, month
        List<Expense> dailyExpenses = allExpenses.stream()
                .filter(e -> e.getDate().isEqual(today))
                .collect(Collectors.toList());
                
        List<Expense> weeklyExpenses = allExpenses.stream()
                .filter(e -> (e.getDate().isAfter(weekStart) || e.getDate().isEqual(weekStart)) 
                            && e.getDate().isBefore(today.plusDays(1)))
                .collect(Collectors.toList());
                
        List<Expense> monthlyExpenses = allExpenses.stream()
                .filter(e -> (e.getDate().isAfter(monthStart) || e.getDate().isEqual(monthStart)) 
                            && e.getDate().isBefore(today.plusDays(1)))
                .collect(Collectors.toList());
        
        // Process top 3 expenses for each time period
        result.put("daily", processTopExpenses(dailyExpenses, categories));
        result.put("weekly", processTopExpenses(weeklyExpenses, categories));
        result.put("monthly", processTopExpenses(monthlyExpenses, categories));
        
        // Calculate totals
        BigDecimal dailyTotal = dailyExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal weeklyTotal = weeklyExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal monthlyTotal = monthlyExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        result.put("dailyTotal", dailyTotal);
        result.put("weeklyTotal", weeklyTotal);
        result.put("monthlyTotal", monthlyTotal);
        
        return result;
    }
    
    private List<Map<String, Object>> processTopExpenses(List<Expense> expenses, List<ExpenseCategory> allCategories) {
        // Group expenses by category
        Map<ExpenseCategory, BigDecimal> categoryTotals = new HashMap<>();
        
        for (Expense expense : expenses) {
            ExpenseCategory category = expense.getCategory();
            BigDecimal currentTotal = categoryTotals.getOrDefault(category, BigDecimal.ZERO);
            categoryTotals.put(category, currentTotal.add(expense.getAmount()));
        }
        
        // Sort by amount and get top 3
        List<Map<String, Object>> result = categoryTotals.entrySet().stream()
                .sorted(Map.Entry.<ExpenseCategory, BigDecimal>comparingByValue().reversed())
                .limit(3)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("category", entry.getKey().getName());
                    map.put("amount", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        
        // If less than 3 categories have expenses, add categories with zero amount
        if (result.size() < 3) {
            Set<String> existingCategories = result.stream()
                    .map(map -> (String) map.get("category"))
                    .collect(Collectors.toSet());
            
            allCategories.stream()
                    .filter(cat -> !existingCategories.contains(cat.getName()))
                    .limit(3 - result.size())
                    .forEach(cat -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("category", cat.getName());
                        map.put("amount", BigDecimal.ZERO);
                        result.add(map);
                    });
        }
        
        return result;
    }
    
    private Map<String, Object> processIncomes(LocalDate today, LocalDate weekStart, LocalDate monthStart) {
        Map<String, Object> result = new HashMap<>();
        
        // Get income data
        Map<String, BigDecimal> dailyIncomes = calculateIncomes(today, today);
        Map<String, BigDecimal> weeklyIncomes = calculateIncomes(weekStart, today);
        Map<String, BigDecimal> monthlyIncomes = calculateIncomes(monthStart, today);
        
        // Process results for daily, weekly, monthly
        result.put("daily", formatIncomes(dailyIncomes));
        result.put("weekly", formatIncomes(weeklyIncomes));
        result.put("monthly", formatIncomes(monthlyIncomes));
        
        // Calculate totals
        BigDecimal dailyTotal = dailyIncomes.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal weeklyTotal = weeklyIncomes.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal monthlyTotal = monthlyIncomes.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        
        result.put("dailyTotal", dailyTotal);
        result.put("weeklyTotal", weeklyTotal);
        result.put("monthlyTotal", monthlyTotal);
        
        return result;
    }
    
    private Map<String, BigDecimal> calculateIncomes(LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> incomes = new HashMap<>();
        
        // Initialize with zero values
        incomes.put("newMemberships", BigDecimal.ZERO);
        incomes.put("membershipRenewals", BigDecimal.ZERO);
        incomes.put("marketSales", BigDecimal.ZERO);
        incomes.put("personalTrainings", BigDecimal.ZERO);
        incomes.put("groupClasses", BigDecimal.ZERO);
        
        // 1. New Memberships
        List<Membership> newMemberships = membershipRepository.findAll().stream()
                .filter(m -> (m.getStartDate().isAfter(startDate) || m.getStartDate().isEqual(startDate))
                        && (m.getStartDate().isBefore(endDate.plusDays(1)) || m.getStartDate().isEqual(endDate)))
                .collect(Collectors.toList());
                
        BigDecimal newMembershipsTotal = newMemberships.stream()
                .map(Membership::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        incomes.put("newMemberships", newMembershipsTotal);
        
        // 2. Membership Renewals
        List<MembershipRenewal> renewals = membershipRenewalRepository.findAll().stream()
                .filter(r -> (r.getRenewalDate().isAfter(startDate) || r.getRenewalDate().isEqual(startDate))
                        && (r.getRenewalDate().isBefore(endDate.plusDays(1)) || r.getRenewalDate().isEqual(endDate)))
                .collect(Collectors.toList());
                
        BigDecimal renewalsTotal = renewals.stream()
                .map(MembershipRenewal::getPaidAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        incomes.put("membershipRenewals", renewalsTotal);
        
        // 3. Market Sales
        List<MarketSalesInvoice> sales = marketSalesInvoiceRepository.findAll().stream()
                .filter(s -> {
                    LocalDate saleDate = s.getSaleDate().toLocalDate();
                    return (saleDate.isAfter(startDate) || saleDate.isEqual(startDate))
                            && (saleDate.isBefore(endDate.plusDays(1)) || saleDate.isEqual(endDate));
                })
                .collect(Collectors.toList());
                
        BigDecimal salesTotal = sales.stream()
                .map(MarketSalesInvoice::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        incomes.put("marketSales", salesTotal);
        
        // 4. Personal Trainings
        List<PtSessionBuy> ptSessions = ptSessionBuyRepository.findAll().stream()
                .filter(pt -> {
                    LocalDate purchaseDate = pt.getPurchaseDate().toLocalDate();
                    return (purchaseDate.isAfter(startDate) || purchaseDate.isEqual(startDate))
                            && (purchaseDate.isBefore(endDate.plusDays(1)) || purchaseDate.isEqual(endDate));
                })
                .collect(Collectors.toList());
                
        BigDecimal ptSessionsTotal = ptSessions.stream()
                .map(PtSessionBuy::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        incomes.put("personalTrainings", ptSessionsTotal);
        
        // 5. Group Classes - Now using the new sale_date column
        List<GroupClassesSale> groupClassesSales = groupClassesSaleRepository.findAll().stream()
                .filter(g -> (g.getSaleDate().isAfter(startDate) || g.getSaleDate().isEqual(startDate))
                        && (g.getSaleDate().isBefore(endDate.plusDays(1)) || g.getSaleDate().isEqual(endDate)))
                .collect(Collectors.toList());
                
        BigDecimal groupClassesTotal = groupClassesSales.stream()
                .map(GroupClassesSale::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        incomes.put("groupClasses", groupClassesTotal);
        
        return incomes;
    }
    
    private List<Map<String, Object>> formatIncomes(Map<String, BigDecimal> incomes) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        // Convert to the format needed by the frontend
        for (Map.Entry<String, BigDecimal> entry : incomes.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            // Format category name for display (convert camelCase to Title Case)
            String formattedCategory = formatCategoryName(entry.getKey());
            item.put("category", formattedCategory);
            item.put("amount", entry.getValue());
            result.add(item);
        }
        
        // Sort by amount descending
        result.sort((a, b) -> ((BigDecimal)b.get("amount")).compareTo((BigDecimal)a.get("amount")));
        
        return result;
    }
    
    private String formatCategoryName(String camelCase) {
        // Convert camelCase to Title Case
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < camelCase.length(); i++) {
            char c = camelCase.charAt(i);
            
            if (i == 0) {
                result.append(Character.toUpperCase(c));
            } else if (Character.isUpperCase(c)) {
                result.append(' ').append(c);
            } else {
                result.append(c);
            }
        }
        
        return result.toString();
    }
} 