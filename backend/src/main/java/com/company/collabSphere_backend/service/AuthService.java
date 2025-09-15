package com.company.collabSphere_backend.service;


import com.company.collabSphere_backend.dtos.*;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.UserRepository;
import com.company.collabSphere_backend.security.JwtService;
import com.company.collabSphere_backend.utils.GeometryUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register new user
    public UserResponseDto register(UserRequestDto requestDto) {
        log.info("Registering new user with email {}", requestDto.getEmail());

        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setRole(requestDto.getRole());
        user.setBio(requestDto.getBio());
        user.setPasswordHash(passwordEncoder.encode(requestDto.getPassword()));

        if (requestDto.getLatitude() != null && requestDto.getLongitude() != null) {
            user.setLocation(GeometryUtil.createPoint(requestDto.getLatitude(), requestDto.getLongitude()));
        }

        User saved = userRepository.save(user);

        return modelMapper.map(saved, UserResponseDto.class);
    }

    // Login existing user → return only token
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        log.info("Login attempt for email {}", loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return LoginResponseDto.builder()
                .token(token)
                .user(modelMapper.map(user, UserResponseDto.class)) // include user info
                .build();
    }
}
