package com.company.collabSphere_backend.dashboard;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentDashboardDto {

    private Long studentId;
    private String name;
    private String email;

    private List<OpportunityDto> activeOpportunities;
    private List<CollaborationRequestDashboardDto> collaborationRequests;
    private List<EndorsementDto> endorsementReceived;
}






