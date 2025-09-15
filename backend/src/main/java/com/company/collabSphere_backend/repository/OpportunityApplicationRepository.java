package com.company.collabSphere_backend.repository;

import com.company.collabSphere_backend.entity.OpportunityApplication;
import com.company.collabSphere_backend.entity.Opportunity;
import com.company.collabSphere_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OpportunityApplicationRepository extends JpaRepository<OpportunityApplication, Long> {
    Optional<OpportunityApplication> findByStudentAndOpportunity(User student, Opportunity opportunity);
    List<OpportunityApplication> findByOpportunity(Opportunity opportunity);
    List<OpportunityApplication> findByStudent(User student);
}