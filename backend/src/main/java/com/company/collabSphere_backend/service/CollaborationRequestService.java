package com.company.collabSphere_backend.service;

import com.company.collabSphere_backend.dtos.CollaborationDecisionDto;
import com.company.collabSphere_backend.dtos.CollaborationRequestDto;
import com.company.collabSphere_backend.dtos.CollaborationResponseDto;
import com.company.collabSphere_backend.entity.CollaborationRequest;
import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.CollaborationStatus;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.CollaborationRequestRepository;
import com.company.collabSphere_backend.repository.ProjectRepository;
import com.company.collabSphere_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CollaborationRequestService {

    private final CollaborationRequestRepository collaborationRequestRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;
    private final EmailService emailService; // ✅ Added EmailService

    public CollaborationResponseDto applyForCollaboration(CollaborationRequestDto requestDto){
        log.info("Student {} applying for project {}",requestDto.getStudentId(),requestDto.getProjectId());

        User student = userRepository.findById(requestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + requestDto.getStudentId()));

        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + requestDto.getProjectId()));

        if (project.getOwner().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Project owner cannot apply for collaboration on their own project");
        }

        collaborationRequestRepository.findByStudentAndProject(student, project)
                .ifPresent(existing -> {
                    throw new RuntimeException("Request already exists for this project and student");
                });

        CollaborationRequest request = CollaborationRequest.builder()
                .student(student)
                .project(project)
                .status(CollaborationStatus.PENDING)
                .build();

        CollaborationRequest saved = collaborationRequestRepository.save(request);
        log.info("Collaboration request {} created successfully", saved.getId());

        // 🔔 In-app notification to project owner
        notificationService.createNotification(
                project.getOwner().getId(),
                "NEW_COLLAB_REQUEST",
                "Student " + student.getName() + " has applied to collaborate on your project '" + project.getTitle() + "'",
                project.getId()
        );

        // ✉️ Email notification to project owner
        emailService.sendEmail(
                project.getOwner().getEmail(),
                "New Collaboration Request",
                "Student " + student.getName() + " has applied to collaborate on your project '" + project.getTitle() + "'. Please review the request."
        );

        return modelMapper.map(saved, CollaborationResponseDto.class);
    }

    public CollaborationResponseDto decideCollaboration(Long requestId, CollaborationDecisionDto decisionDto, Long ownerId){
        log.info("Owner {} deciding request {} with status {}",ownerId, requestId,decisionDto.getStatus());

        CollaborationRequest request = collaborationRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Collaboration request not found with id " + requestId));

        if(!request.getProject().getOwner().getId().equals(ownerId)){
            throw new RuntimeException("Only project owner can make decisions");
        }

        request.setStatus(decisionDto.getStatus());
        CollaborationRequest updated = collaborationRequestRepository.save(request);

        log.info("Request {} updated to {}",updated.getId(),updated.getStatus());

        // 🔔 In-app notification to student
        notificationService.createNotification(
                request.getStudent().getId(),
                "COLLAB_REQUEST_" + decisionDto.getStatus(), // e.g., COLLAB_REQUEST_ACCEPTED / COLLAB_REQUEST_REJECTED
                "Your collaboration request for project '" + request.getProject().getTitle() + "' has been " + decisionDto.getStatus().name().toLowerCase(),
                request.getProject().getId()
        );

        // ✉️ Email notification to student
        emailService.sendEmail(
                request.getStudent().getEmail(),
                "Collaboration Request " + decisionDto.getStatus().name(),
                "Your collaboration request for project '" + request.getProject().getTitle() + "' has been " + decisionDto.getStatus().name().toLowerCase() + "."
        );

        return modelMapper.map(updated, CollaborationResponseDto.class);
    }

    public List<CollaborationResponseDto> getRequestsForProject(Long projectId){
        log.info("Fetching collaboration requests for project {}",projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));

        return collaborationRequestRepository.findByProject(project).stream()
                .map(req -> modelMapper.map(req, CollaborationResponseDto.class))
                .collect(Collectors.toList());
    }

    public List<CollaborationResponseDto> getRequestsByStudent(Long studentId){
        log.info("Fetching collaboration requests made by student {}",studentId);

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));

        return collaborationRequestRepository.findByStudent(student).stream()
                .map(req -> modelMapper.map(req, CollaborationResponseDto.class))
                .collect(Collectors.toList());
    }
}
