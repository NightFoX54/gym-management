package com.gymmanagement.controller;

import com.gymmanagement.model.Expense;
import com.gymmanagement.model.ExpenseCategory;
import com.gymmanagement.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;
    
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<ExpenseCategory>> getAllExpenseCategories() {
        return ResponseEntity.ok(expenseService.getAllExpenseCategories());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Integer id) {
        Optional<Expense> expense = expenseService.getExpenseById(id);
        return expense.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense savedExpense = expenseService.saveExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Integer id, @RequestBody Expense expense) {
        if (!expenseService.getExpenseById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        expense.setId(id);
        return ResponseEntity.ok(expenseService.saveExpense(expense));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Integer id) {
        if (!expenseService.getExpenseById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(expenseService.getExpensesByDateRange(startDate, endDate));
    }
    
    @GetMapping("/total")
    public ResponseEntity<Map<String, Object>> getTotalExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(Map.of("total", expenseService.getTotalExpensesByDateRange(startDate, endDate)));
    }
} 