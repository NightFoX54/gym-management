package com.gymmanagement.service;

import com.gymmanagement.model.Expense;
import com.gymmanagement.model.ExpenseCategory;
import com.gymmanagement.repository.ExpenseCategoryRepository;
import com.gymmanagement.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private ExpenseCategoryRepository expenseCategoryRepository;
    
    public List<Expense> getAllExpenses() {
        return expenseRepository.findByOrderByDateDesc();
    }
    
    public List<ExpenseCategory> getAllExpenseCategories() {
        return expenseCategoryRepository.findAll();
    }
    
    public Optional<Expense> getExpenseById(Integer id) {
        return expenseRepository.findById(id);
    }
    
    @Transactional
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    
    @Transactional
    public void deleteExpense(Integer id) {
        expenseRepository.deleteById(id);
    }
    
    public List<Expense> getExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByDateBetweenOrderByDateDesc(startDate, endDate);
    }
    
    public BigDecimal getTotalExpensesByDateRange(LocalDate startDate, LocalDate endDate) {
        BigDecimal total = expenseRepository.calculateTotalExpensesBetweenDates(startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
} 