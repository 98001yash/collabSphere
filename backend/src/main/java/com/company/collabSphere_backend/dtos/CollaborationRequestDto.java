package com.company.collabSphere_backend.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationRequestDto {

    private Long studentId;
    private Long projectId;
}
