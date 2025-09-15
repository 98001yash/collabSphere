package com.company.collabSphere_backend.service;


import com.company.collabSphere_backend.dtos.OpportunityApplicationRequestDto;
import com.company.collabSphere_backend.dtos.OpportunityApplicationResponseDto;
import com.company.collabSphere_backend.entity.Opportunity;
import com.company.collabSphere_backend.entity.OpportunityApplication;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.ApplicationStatus;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.OpportunityApplicationRepository;
import com.company.collabSphere_backend.repository.OpportunityRepository;
import com.company.collabSphere_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OpportunityApplicationService {

    private final OpportunityApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public OpportunityApplicationResponseDto applyToOpportunity(OpportunityApplicationRequestDto requestDto){
        log.info("Student applying to opportunity: {}",requestDto.getOpportunityId());

        // get logged in yser
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(()->new ResourceNotFoundException("Student not found: "+email));

        Opportunity opportunity = opportunityRepository.findById(requestDto.getOpportunityId())
                .orElseThrow(()->new ResourceNotFoundException("Opportunity not found with id: "+requestDto.getOpportunityId()));

        //validations
        if(opportunity.getApplicationDeadline() !=null && opportunity.getApplicationDeadline().isBefore(LocalDateTime.now())){
            throw new IllegalStateException("cannot apply: Application  deadline has passed/");
        }
        if(opportunity.getCreatedBy().getId().equals(student.getId())){
            throw new IllegalStateException("creator cannot apply to their own opportunity.");
        }

        if(applicationRepository.findByStudentAndOpportunity(student, opportunity).isPresent()){
            throw new IllegalStateException("You have already applied to this opportunity");
        }

        //  Create application
        OpportunityApplication application = OpportunityApplication.builder()
                .opportunity(opportunity)
                .student(student)
                .status(ApplicationStatus.APPLIED)
                .build();

        OpportunityApplication saved = applicationRepository.save(application);


        return OpportunityApplicationResponseDto.builder()
                .id(saved.getId())
                .opportunityId(opportunity.getId())
                .opportunityTitle(opportunity.getTitle())
                .studentId(student.getId())
                .studentName(student.getName())
                .status(saved.getStatus())
                .appliedAt(saved.getAppliedAt())
                .build();
    }

    public List<OpportunityApplicationResponseDto> getApplicationsForOpportunity(Long opportunityId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id " + opportunityId));

        return applicationRepository.findByOpportunity(opportunity)
                .stream()
                .map(app -> OpportunityApplicationResponseDto.builder()
                        .id(app.getId())
                        .opportunityId(opportunity.getId())
                        .opportunityTitle(opportunity.getTitle())
                        .studentId(app.getStudent().getId())
                        .studentName(app.getStudent().getName())
                        .status(app.getStatus())
                        .appliedAt(app.getAppliedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

    public List<OpportunityApplicationResponseDto> getApplicationsForStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + email));

        return applicationRepository.findByStudent(student)
                .stream()
                .map(app -> OpportunityApplicationResponseDto.builder()
                        .id(app.getId())
                        .opportunityId(app.getOpportunity().getId())
                        .opportunityTitle(app.getOpportunity().getTitle())
                        .studentId(student.getId())
                        .studentName(student.getName())
                        .status(app.getStatus())
                        .appliedAt(app.getAppliedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }
}


