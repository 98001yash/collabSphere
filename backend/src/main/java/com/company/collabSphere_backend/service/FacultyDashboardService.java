package com.company.collabSphere_backend.service;

import com.company.collabSphere_backend.dashboard.*;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.CollaborationRequestRepository;
import com.company.collabSphere_backend.repository.EndorsementRepository;
import com.company.collabSphere_backend.repository.OpportunityRepository;
import com.company.collabSphere_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacultyDashboardService {

    private final UserRepository userRepository;
    private final OpportunityRepository opportunityRepository;
    private final CollaborationRequestRepository collaborationRequestRepository;
    private final EndorsementRepository endorsementRepository;
    private final ModelMapper modelMapper;

    public FacultyDashboardDto getFacultyDashboard(Long facultyId) {
        log.info("Fetching dashboard for faculty {}", facultyId);

        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id " + facultyId));

        // Opportunities posted by this faculty (if you keep this, else remove if not needed)
        List<OpportunityDto> opportunitiesPosted = opportunityRepository
                .findByCreatedBy(faculty)  // This works now
                .stream()
                .map(op -> modelMapper.map(op, OpportunityDto.class))
                .collect(Collectors.toList());



        // Pending Collaboration requests for faculty’s projects
        List<PendingCollaborationRequestDto> pendingCollaborationRequests = collaborationRequestRepository
                .findByProjectOwnerId(facultyId)
                .stream()
                .map(cr -> PendingCollaborationRequestDto.builder()
                        .requestId(cr.getId())
                        .projectId(cr.getProject().getId())
                        .projectTitle(cr.getProject().getTitle())
                        .status(cr.getStatus().name())
                        .appliedAt(cr.getCreatedAt())
                        .studentName(cr.getStudent().getName())
                        .build())
                .collect(Collectors.toList());

        // Endorsements given by this faculty
        List<EndorsementDto> endorsementsGiven = endorsementRepository
                .findByFaculty(faculty)
                .stream()
                .map(e -> EndorsementDto.builder()
                        .endorsementId(e.getId())
                        .from(faculty.getName())
                        .project(e.getProject().getTitle())
                        .message(e.getFeedback())
                        .date(e.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // Build and return dashboard
        return FacultyDashboardDto.builder()
                .facultyId(faculty.getId())
                .name(faculty.getName())
                .email(faculty.getEmail())
                .pendingCollaborationRequests(pendingCollaborationRequests)
                .endorsementsGiven(endorsementsGiven)
                .build();
    }
}

