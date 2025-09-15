package com.company.collabSphere_backend.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LoginResponseDto {

    private String token;
    private UserResponseDto user;
}
