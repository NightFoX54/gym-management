package com.gymmanagement.repository;

import com.gymmanagement.model.ContactForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactFormRepository extends JpaRepository<ContactForm, Integer> {
    List<ContactForm> findByIsReadOrderByIdDesc(Boolean isRead);
    List<ContactForm> findAllByOrderByIdDesc();
    
    // New methods with date ordering
    List<ContactForm> findByIsReadOrderByDateCreatedDesc(Boolean isRead);
    List<ContactForm> findByIsReadOrderByDateCreatedAsc(Boolean isRead);
    List<ContactForm> findAllByOrderByDateCreatedDesc();
    List<ContactForm> findAllByOrderByDateCreatedAsc();
} 