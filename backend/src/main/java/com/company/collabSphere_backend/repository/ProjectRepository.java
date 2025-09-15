package com.company.collabSphere_backend.repository;

import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Long> {


    List<Project> findByOwnerId(Long ownerId);

    List<Project> findByStatus(ProjectStatus status);

    // Example: Find projects near a location (within X meters)
    @Query(value = """
            SELECT * FROM projects p
            WHERE ST_DWithin(p.location, ST_MakePoint(:longitude, :latitude)::geography, :radius)
            """, nativeQuery = true)
    List<Project> findNearbyProjects(double latitude, double longitude, double radius);


    List<Project> findByOwner(User owner);
}

