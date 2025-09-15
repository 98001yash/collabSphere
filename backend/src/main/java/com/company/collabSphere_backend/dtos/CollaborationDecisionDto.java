package com.company.collabSphere_backend.dtos;


import com.company.collabSphere_backend.enums.CollaborationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationDecisionDto {

    private CollaborationStatus status;
}
