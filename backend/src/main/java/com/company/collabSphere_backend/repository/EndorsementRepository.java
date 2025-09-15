package com.company.collabSphere_backend.repository;

import com.company.collabSphere_backend.entity.Endorsement;
import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EndorsementRepository extends JpaRepository<Endorsement,Long> {

    List<Endorsement> findByProject(Project project);
    List<Endorsement> findByFaculty(User faculty);

    // For student dashboard: endorsements received
    List<Endorsement> findByStudentId(Long studentId);

    // for faculty dashboard: endorsements given by faculty
    List<Endorsement> findByFacultyId(Long facultyId);

    List<Endorsement> findByStudent(User student);

    boolean existsByFacultyAndProject(User faculty, Project project);

}
