package com.company.collabSphere_backend.service;

import com.company.collabSphere_backend.dtos.ProjectRequestDto;
import com.company.collabSphere_backend.dtos.ProjectResponseDto;
import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.ProjectStatus;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.ProjectRepository;
import com.company.collabSphere_backend.repository.UserRepository;
import com.company.collabSphere_backend.utils.GeometryUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.ResourceClosedException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService; // In-app notifications
    private final EmailService emailService; // Email notifications

    // Create project
    public ProjectResponseDto createProject(ProjectRequestDto projectRequestDto, Long ownerId) {
        log.info("Creating project: {} for ownerId: {}", projectRequestDto.getTitle(), ownerId);

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id " + ownerId));

        Project project = modelMapper.map(projectRequestDto, Project.class);
        project.setOwner(owner);
        project.setStatus(ProjectStatus.PENDING);

        // Ensure location is set
        project.setLocation(
                GeometryUtil.createPoint(projectRequestDto.getLatitude(), projectRequestDto.getLongitude())
        );

        Project savedProject = projectRepository.save(project);
        log.info("Project created successfully with id: {}", savedProject.getId());

        // 🔔 In-app notification
        Long adminId = 1L; // Example: notify admin
        notificationService.createNotification(
                adminId,
                "PROJECT_CREATED",
                "New project created: " + savedProject.getTitle(),
                savedProject.getId()
        );

        // ✉️ Email notification
        emailService.sendEmail(
                owner.getEmail(),
                "Project Created Successfully",
                "Your project '" + savedProject.getTitle() + "' has been created successfully."
        );

        return modelMapper.map(savedProject, ProjectResponseDto.class);
    }

    // Get all projects
    public List<ProjectResponseDto> getAllProjects() {
        log.info("Fetching all projects");
        return projectRepository.findAll().stream()
                .map(project -> modelMapper.map(project, ProjectResponseDto.class))
                .collect(Collectors.toList());
    }

    // Get project by id
    public ProjectResponseDto getProjectById(Long id) {
        log.info("Fetching project by id: {}", id);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));

        return modelMapper.map(project, ProjectResponseDto.class);
    }

    // Update project status
    public ProjectResponseDto updateProjectStatus(Long id, ProjectStatus status) {
        log.info("Updating status for project id: {} to {}", id, status);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));

        project.setStatus(status);
        Project updatedProject = projectRepository.save(project);

        // 🔔 In-app notification
        notificationService.createNotification(
                project.getOwner().getId(),
                "PROJECT_STATUS_UPDATED",
                "Your project '" + project.getTitle() + "' status has been updated to " + status,
                project.getId()
        );

        // ✉️ Email notification
        emailService.sendEmail(
                project.getOwner().getEmail(),
                "Project Status Updated",
                "Your project '" + project.getTitle() + "' status has been updated to " + status
        );

        return modelMapper.map(updatedProject, ProjectResponseDto.class);
    }

    // Delete project
    public void deleteProject(Long id) {
        log.info("Deleting project with id: {}", id);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));

        projectRepository.delete(project);
        log.info("Project with id {} deleted successfully", id);

        // 🔔 In-app notification
        notificationService.createNotification(
                project.getOwner().getId(),
                "PROJECT_DELETED",
                "Your project '" + project.getTitle() + "' has been deleted",
                project.getId()
        );

        // ✉️ Email notification
        emailService.sendEmail(
                project.getOwner().getEmail(),
                "Project Deleted",
                "Your project '" + project.getTitle() + "' has been deleted."
        );
    }

    // Get projects for a specific owner
    public List<ProjectResponseDto> getProjectByOwner(Long ownerId) {
        log.info("Fetching projects for ownerId: {}", ownerId);

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceClosedException("Owner not found with id: " + ownerId));

        return projectRepository.findByOwner(owner).stream()
                .map(project -> modelMapper.map(project, ProjectResponseDto.class))
                .collect(Collectors.toList());
    }
}
