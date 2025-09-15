package com.company.collabSphere_backend.dtos;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpportunityApplicationRequestDto {

    @NotNull
    private Long opportunityId;
}
