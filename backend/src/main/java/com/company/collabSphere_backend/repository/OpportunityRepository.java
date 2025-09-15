package com.company.collabSphere_backend.repository;

import com.company.collabSphere_backend.entity.Opportunity;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.OpportunityStatus;
import com.company.collabSphere_backend.enums.OpportunityType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    List<Opportunity> findByStatus(OpportunityStatus status);

    List<Opportunity> findByTypeAndStatus(OpportunityType type, OpportunityStatus status);

    // For student dashboard: active opportunities with deadline not passed
    List<Opportunity> findByStatusAndApplicationDeadlineAfter(OpportunityStatus status, LocalDateTime now);

    // For faculty dashboard: all opportunities created by a faculty
    List<Opportunity> findByCreatedBy(User user);  // Keep this

    List<Opportunity> findByCreatedById(Long facultyId); // Optional, if you want to fetch by id
}
