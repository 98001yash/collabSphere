package com.company.collabSphere_backend.dtos;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndorsementRequestDto {

    private Long facultyId;
    private Long projectId;
    private String feedback;
}
