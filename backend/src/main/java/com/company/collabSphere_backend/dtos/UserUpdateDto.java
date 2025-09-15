package com.company.collabSphere_backend.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDto {

    private String name;
    private String bio;
    private String role;

    private Double latitude;
    private Double longitude;
}
