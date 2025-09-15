package com.company.collabSphere_backend.dtos;

import com.company.collabSphere_backend.enums.CollaborationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationResponseDto {

    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;

    private Long projectId;
    private String projectTitle;

    private CollaborationStatus status;

    private LocalDateTime createdAt;
}
