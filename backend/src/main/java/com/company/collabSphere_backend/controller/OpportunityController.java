package com.company.collabSphere_backend.controller;


import com.company.collabSphere_backend.dtos.OpportunityRequestDto;
import com.company.collabSphere_backend.dtos.OpportunityResponseDto;
import com.company.collabSphere_backend.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
@Slf4j
public class OpportunityController {

    private final OpportunityService opportunityService;


    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<OpportunityResponseDto> createOpportunity(@RequestBody OpportunityRequestDto requestDto) {
        log.info("API Call: Create Opportunity {}", requestDto.getTitle());
        return ResponseEntity.ok(opportunityService.createOpportunity(requestDto));
    }


    @PutMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<OpportunityResponseDto> publishOpportunity(@PathVariable Long id) {
        log.info("API Call: Publish Opportunity {}", id);
        return ResponseEntity.ok(opportunityService.publishOpportunity(id));
    }


    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('STUDENT','FACULTY','ADMIN')")
    public ResponseEntity<List<OpportunityResponseDto>> getActiveOpportunities() {
        log.info("API Call: Fetch Active Opportunities");
        return ResponseEntity.ok(opportunityService.getActiveOpportunities());
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','FACULTY','ADMIN')")
    public ResponseEntity<OpportunityResponseDto> getOpportunityById(@PathVariable Long id) {
        log.info("API Call: Fetch Opportunity {}", id);
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable Long id) {
        log.info("API Call: Delete Opportunity {}", id);
        opportunityService.deleteOpportunity(id);
        return ResponseEntity.noContent().build();
    }
}

