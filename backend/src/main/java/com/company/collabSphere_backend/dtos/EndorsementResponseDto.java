package com.company.collabSphere_backend.dtos;


import com.company.collabSphere_backend.enums.EndorsementStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndorsementResponseDto {

    private Long id;
    private Long facultyId;
    private Long projectId;
    private String feedback;
    private EndorsementStatus status;
    private LocalDateTime createdAt;
}
