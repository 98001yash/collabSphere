package com.company.collabSphere_backend.controller;


import com.company.collabSphere_backend.dtos.OpportunityApplicationRequestDto;
import com.company.collabSphere_backend.dtos.OpportunityApplicationResponseDto;
import com.company.collabSphere_backend.service.OpportunityApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Slf4j
public class OpportunityApplicationController {

    private final OpportunityApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<OpportunityApplicationResponseDto> apply(@RequestBody OpportunityApplicationRequestDto requestDto) {
        log.info("API Call: Apply to opportunity {}", requestDto.getOpportunityId());
        return ResponseEntity.ok(applicationService.applyToOpportunity(requestDto));
    }

    @GetMapping("/opportunity/{id}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<List<OpportunityApplicationResponseDto>> getApplicationsForOpportunity(@PathVariable Long id) {
        log.info("API Call: Get applications for opportunity {}", id);
        return ResponseEntity.ok(applicationService.getApplicationsForOpportunity(id));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<OpportunityApplicationResponseDto>> getApplicationsForStudent() {
        log.info("API Call: Get applications for logged-in student");
        return ResponseEntity.ok(applicationService.getApplicationsForStudent());
    }
}
