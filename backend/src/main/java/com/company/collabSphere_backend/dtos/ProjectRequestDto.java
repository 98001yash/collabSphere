package com.company.collabSphere_backend.dtos;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectRequestDto {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String repoUrl;

    // project geo-location
    private Double latitude;
    private Double longitude;
}
