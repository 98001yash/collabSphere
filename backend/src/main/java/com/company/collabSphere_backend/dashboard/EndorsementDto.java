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
public class EndorsementDto {
    private Long endorsementId;
    private String from;
    private String project;
    private String message;
    private LocalDateTime date;
}
