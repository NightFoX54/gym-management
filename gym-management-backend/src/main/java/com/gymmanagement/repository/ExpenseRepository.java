package com.gymmanagement.repository;

import com.gymmanagement.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    
    List<Expense> findByOrderByDateDesc();
    
    List<Expense> findByDateBetweenOrderByDateDesc(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.date BETWEEN ?1 AND ?2")
    BigDecimal calculateTotalExpensesBetweenDates(LocalDate startDate, LocalDate endDate);
} 