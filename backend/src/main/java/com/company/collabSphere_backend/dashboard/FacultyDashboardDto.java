package com.company.collabSphere_backend.dashboard;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacultyDashboardDto {
    private Long facultyId;
    private String name;
    private String email;

    private List<PendingCollaborationRequestDto> pendingCollaborationRequests;
    private List<EndorsementDto> endorsementsGiven;
}

