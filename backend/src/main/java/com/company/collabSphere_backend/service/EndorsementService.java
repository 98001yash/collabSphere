package com.company.collabSphere_backend.service;

import com.company.collabSphere_backend.dtos.EndorsementRequestDto;
import com.company.collabSphere_backend.dtos.EndorsementResponseDto;
import com.company.collabSphere_backend.entity.Endorsement;
import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.EndorsementStatus;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.EndorsementRepository;
import com.company.collabSphere_backend.repository.ProjectRepository;
import com.company.collabSphere_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EndorsementService {

    private final EndorsementRepository endorsementRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;
    private final EmailService emailService; // ✅ Added email service

    @Transactional
    public EndorsementResponseDto endorseProject(EndorsementRequestDto requestDto) {
        log.info("Faculty {} is endorsing project {}", requestDto.getFacultyId(), requestDto.getProjectId());

        User faculty = userRepository.findById(requestDto.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + requestDto.getFacultyId()));

        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + requestDto.getProjectId()));

        // prevent duplicate endorsement
        boolean alreadyEndorsed = endorsementRepository.existsByFacultyAndProject(faculty, project);
        if (alreadyEndorsed) {
            throw new IllegalStateException("Faculty has already endorsed this project");
        }

        Endorsement endorsement = Endorsement.builder()
                .faculty(faculty)
                .project(project)
                .feedback(requestDto.getFeedback())
                .status(EndorsementStatus.ENDORSED)
                .build();

        Endorsement saved = endorsementRepository.save(endorsement);

        // update owner reputation & project score
        User owner = project.getOwner();
        owner.setReputationPoints((owner.getReputationPoints() == null ? 0 : owner.getReputationPoints()) + 10);
        project.setEndorsementScore((project.getEndorsementScore() == null ? 0 : project.getEndorsementScore()) + 1);

        userRepository.save(owner);
        projectRepository.save(project);

        // 🔔 In-app notification
        notificationService.createNotification(
                owner.getId(),
                "PROJECT_ENDORSED",
                "Your project '" + project.getTitle() + "' has been endorsed by " + faculty.getName(),
                project.getId()
        );

        // ✉️ Email notification
        emailService.sendEmail(
                owner.getEmail(),
                "Your Project Has Been Endorsed",
                "Congratulations! Your project '" + project.getTitle() + "' has been endorsed by " + faculty.getName() +
                        ". Feedback: " + requestDto.getFeedback()
        );

        return modelMapper.map(saved, EndorsementResponseDto.class);
    }

    // Revoke endorsement
    @Transactional
    public EndorsementResponseDto revokeEndorsement(Long endorsementId) {
        log.info("Revoking endorsement with id: {}", endorsementId);

        Endorsement endorsement = endorsementRepository.findById(endorsementId)
                .orElseThrow(() -> new ResourceNotFoundException("Endorsement not found with id " + endorsementId));

        if (endorsement.getStatus() == EndorsementStatus.REVOKED) {
            throw new IllegalStateException("Endorsement is already revoked");
        }

        endorsement.setStatus(EndorsementStatus.REVOKED);

        Project project = endorsement.getProject();
        User owner = project.getOwner();

        // reduce points & score
        owner.setReputationPoints(Math.max(0, owner.getReputationPoints() - 10));
        project.setEndorsementScore(Math.max(0, project.getEndorsementScore() - 1));

        userRepository.save(owner);
        projectRepository.save(project);

        // 🔔 In-app notification
        notificationService.createNotification(
                owner.getId(),
                "ENDORSEMENT_REVOKED",
                "An endorsement for your project '" + project.getTitle() + "' has been revoked by " + endorsement.getFaculty().getName(),
                project.getId()
        );

        // ✉️ Email notification
        emailService.sendEmail(
                owner.getEmail(),
                "Endorsement Revoked",
                "Attention! An endorsement for your project '" + project.getTitle() + "' has been revoked by " +
                        endorsement.getFaculty().getName() + "."
        );

        Endorsement updated = endorsementRepository.save(endorsement);
        return modelMapper.map(updated, EndorsementResponseDto.class);
    }

    // Get endorsements by project
    public List<EndorsementResponseDto> getEndorsementsByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + projectId));

        return endorsementRepository.findByProject(project).stream()
                .map(e -> modelMapper.map(e, EndorsementResponseDto.class))
                .collect(Collectors.toList());
    }

    // Get endorsements by faculty
    public List<EndorsementResponseDto> getEndorsementsByFaculty(Long facultyId) {
        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id " + facultyId));

        return endorsementRepository.findByFaculty(faculty).stream()
                .map(e -> modelMapper.map(e, EndorsementResponseDto.class))
                .collect(Collectors.toList());
    }
}
