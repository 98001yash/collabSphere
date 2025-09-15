package com.company.collabSphere_backend.controller;


import com.company.collabSphere_backend.dtos.CollaborationDecisionDto;
import com.company.collabSphere_backend.dtos.CollaborationRequestDto;
import com.company.collabSphere_backend.dtos.CollaborationResponseDto;
import com.company.collabSphere_backend.service.CollaborationRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/collaborations")
@RequiredArgsConstructor
public class CollaborationRequestController {

    private final CollaborationRequestService collaborationRequestService;

    // student applies for a project
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CollaborationResponseDto> applyForCollaboration(
            @RequestBody CollaborationRequestDto requestDto
    ) {
        log.info("Student {} applying for project {}", requestDto.getStudentId(), requestDto.getProjectId());
        return ResponseEntity.ok(collaborationRequestService.applyForCollaboration(requestDto));
    }

    // project owner decide to ACCEPT / REJECT request
    @PutMapping("/{requestId}/decide")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CollaborationResponseDto> decideRequest(
            @PathVariable Long requestId,
            @RequestBody CollaborationDecisionDto decisionDto,
            @RequestParam Long ownerId
    ) {
        log.info("Owner {} making decision on request {}", ownerId, requestId);
        return ResponseEntity.ok(collaborationRequestService.decideCollaboration(requestId, decisionDto, ownerId));
    }


    // get all projects for the project (only owner can view)
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CollaborationResponseDto>> getRequestsForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(collaborationRequestService.getRequestsForProject(projectId));
    }


    // get all request made by a student
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CollaborationResponseDto>> getRequestsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(collaborationRequestService.getRequestsByStudent(studentId));
    }
}
