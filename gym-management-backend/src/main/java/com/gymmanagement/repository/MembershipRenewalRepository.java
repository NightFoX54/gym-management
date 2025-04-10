package com.gymmanagement.repository;

import com.gymmanagement.model.MembershipRenewal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipRenewalRepository extends JpaRepository<MembershipRenewal, Integer> {
    List<MembershipRenewal> findByMembershipId(Long membershipId);
} 