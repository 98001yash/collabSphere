package com.company.collabSphere_backend.service;


import com.company.collabSphere_backend.dtos.UserResponseDto;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    // Get all users
    public List<UserResponseDto> getAllUsers() {
        log.info("Fetching all users");

        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDto.class))
                .collect(Collectors.toList());
    }

    // Get user by ID
    public UserResponseDto getUserById(Long id) {
        log.info("Fetching user by id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        return modelMapper.map(user, UserResponseDto.class);
    }

    // Update bio
    public UserResponseDto updateBio(Long id, String bio) {
        log.info("Updating bio for user id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        user.setBio(bio);
        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserResponseDto.class);
    }

    // Delete user
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        userRepository.delete(user);
        log.info("User with id {} deleted successfully", id);
    }




    // Get current user profile by username (from Authentication principal)
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
        return modelMapper.map(user, UserResponseDto.class);
    }


}
