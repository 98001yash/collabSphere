package com.company.collabSphere_backend.dtos;

import com.company.collabSphere_backend.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpportunityApplicationResponseDto {
    private Long id;
    private Long opportunityId;
    private String opportunityTitle;
    private Long studentId;
    private String studentName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}