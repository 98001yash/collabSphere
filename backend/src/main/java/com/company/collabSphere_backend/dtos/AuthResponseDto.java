package com.company.collabSphere_backend.dtos;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponseDto {

    private String token;
    private UserResponseDto user;
}
