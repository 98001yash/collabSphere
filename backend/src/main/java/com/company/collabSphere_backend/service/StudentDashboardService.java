package com.company.collabSphere_backend.service;

import com.company.collabSphere_backend.dashboard.CollaborationRequestDashboardDto;
import com.company.collabSphere_backend.dashboard.EndorsementDto;
import com.company.collabSphere_backend.dashboard.OpportunityDto;
import com.company.collabSphere_backend.dashboard.StudentDashboardDto;

import com.company.collabSphere_backend.entity.*;
import com.company.collabSphere_backend.enums.OpportunityStatus;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentDashboardService {

    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final CollaborationRequestRepository collaborationRequestRepository;
    private final EndorsementRepository endorsementRepository;
    private final ModelMapper modelMapper;

    public StudentDashboardDto getStudentDashboard(Long studentId) {
        log.info("Fetching dashboard for student {}", studentId);


        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));


        List<OpportunityDto> activeOpportunities = opportunityRepository
                .findByStatus(OpportunityStatus.PUBLISHED)
                .stream()
                .map(op -> modelMapper.map(op, OpportunityDto.class))
                .collect(Collectors.toList());

        List<CollaborationRequestDashboardDto> collabRequests = collaborationRequestRepository
                .findByStudent(student)
                .stream()
                .map(cr -> CollaborationRequestDashboardDto.builder()
                        .requestId(cr.getId())
                        .projectId(cr.getProject().getId())
                        .projectTitle(cr.getProject().getTitle())
                        .status(cr.getStatus().name())
                        .appliedAt(cr.getCreatedAt())
                        .ownerName(cr.getProject().getOwner().getName())
                        .build())
                .collect(Collectors.toList());

        List<EndorsementDto> endorsements = endorsementRepository
                .findByStudent(student)
                .stream()
                .map(e -> EndorsementDto.builder()
                        .endorsementId(e.getId())
                        .from(e.getFaculty().getName())
                        .project(e.getProject().getTitle())
                        .message(e.getFeedback())
                        .date(e.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return StudentDashboardDto.builder()
                .studentId(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .activeOpportunities(activeOpportunities)
                .collaborationRequests(collabRequests)
                .endorsementReceived(endorsements)
                .build();
    }
}
