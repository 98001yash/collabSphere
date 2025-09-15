package com.company.collabSphere_backend.controller;

import com.company.collabSphere_backend.dtos.*;
import com.company.collabSphere_backend.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    //  permission to all the people to register
    @PostMapping("/register")
    @PermitAll
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody UserRequestDto requestDto) {
        return ResponseEntity.ok(authService.register(requestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}
