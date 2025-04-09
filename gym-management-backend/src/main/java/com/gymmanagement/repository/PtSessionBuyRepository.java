package com.gymmanagement.repository;

import com.gymmanagement.model.PtSessionBuy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PtSessionBuyRepository extends JpaRepository<PtSessionBuy, Long> {
    List<PtSessionBuy> findByClientId(Long clientId);
} 