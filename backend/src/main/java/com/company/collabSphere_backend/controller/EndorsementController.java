package com.company.collabSphere_backend.controller;


import com.company.collabSphere_backend.dtos.EndorsementRequestDto;
import com.company.collabSphere_backend.dtos.EndorsementResponseDto;
import com.company.collabSphere_backend.service.EndorsementService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/endorsements")
@RequiredArgsConstructor
@Slf4j
public class EndorsementController {

    private final EndorsementService endorsementService;

    // faculty endorse the project
    @PostMapping
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<EndorsementResponseDto> endorseProject(@RequestBody EndorsementRequestDto requestDto){
        log.info("Received endorsement request from faculty {} to project {}",
                requestDto.getFacultyId(),requestDto.getProjectId());

        return ResponseEntity.ok(endorsementService.endorseProject(requestDto));
    }

    // Get endorsement by project
    @GetMapping("/project/{projectId}")
    @PermitAll
    public ResponseEntity<List<EndorsementResponseDto>> getEndorsementsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(endorsementService.getEndorsementsByProject(projectId));
    }

    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EndorsementResponseDto>> getEndorsementByFaculty(@PathVariable Long facultyId){
        return ResponseEntity.ok(endorsementService.getEndorsementsByFaculty(facultyId));
    }


    @PutMapping("/{endorsementId}/revoke")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<EndorsementResponseDto> revokeEndorsement(@PathVariable Long endorsementId) {
        return ResponseEntity.ok(endorsementService.revokeEndorsement(endorsementId));
    }

}
