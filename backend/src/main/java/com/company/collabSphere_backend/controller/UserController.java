package com.company.collabSphere_backend.controller;

import com.company.collabSphere_backend.dashboard.FacultyDashboardDto;
import com.company.collabSphere_backend.dashboard.StudentDashboardDto;
import com.company.collabSphere_backend.dtos.UserResponseDto;
import com.company.collabSphere_backend.service.FacultyDashboardService;
import com.company.collabSphere_backend.service.StudentDashboardService;
import com.company.collabSphere_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;



@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final StudentDashboardService studentDashboardService;
    private final FacultyDashboardService facultyDashboardService;



    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers(){
        log.info("Fetching all users");
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id){
        log.info("Fetching  user with id: {}",id);
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PatchMapping("/{id}/bio")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<UserResponseDto> updateUserBio(
            @PathVariable Long id,
            @RequestBody String newBio
    ) {
        log.info("Updating bio for user ID: {}", id);
        return ResponseEntity.ok(userService.updateBio(id, newBio));
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Deleting user with ID: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    //    Get Student Dashboard

    @GetMapping("/student/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardDto> getStudentDashboard(@PathVariable Long id){
        return ResponseEntity.ok(studentDashboardService.getStudentDashboard(id));
    }


    // get Faculty Dashboard
    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<FacultyDashboardDto> getFacultyDashboard(@PathVariable Long facultyId) {
        log.info("Fetching dashboard for faculty {}", facultyId);
        return ResponseEntity.ok(facultyDashboardService.getFacultyDashboard(facultyId));
    }


    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUserProfile(Authentication authentication) {
        String email = authentication.getName(); // from JWT principal
        UserResponseDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

}
