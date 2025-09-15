package com.company.collabSphere_backend.dtos;


import com.company.collabSphere_backend.enums.ProjectStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponseDto {

    private Long id;
    private String title;
    private String description;
    private String repoUrl;
    private ProjectStatus status;

    // owner info (basic only to avoid recursion)
    private Long ownerId;
    private String ownerName;

    private Double latitude;
    private Double longitude;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
