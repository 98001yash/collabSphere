package com.company.collabSphere_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
class ProjectDto {
    private Long projectId;
    private String title;
    private String description;
    private Integer collaboratorsCount;
    private String status; // ONGOING, COMPLETED, DRAFT
}