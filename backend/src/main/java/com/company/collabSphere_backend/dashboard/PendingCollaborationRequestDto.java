package com.company.collabSphere_backend.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PendingCollaborationRequestDto {
    private Long requestId;
    private Long projectId;
    private String projectTitle;
    private String status;  // PENDING, ACCEPTED, REJECTED
    private LocalDateTime appliedAt;
    private String studentName; // who applied
}
