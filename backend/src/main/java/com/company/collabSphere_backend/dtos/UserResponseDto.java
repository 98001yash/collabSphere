package com.company.collabSphere_backend.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String bio;

    // flatten the Point into lat/lng
    private Double latitude;
    private Double longitude;
}