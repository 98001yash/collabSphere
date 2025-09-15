package com.company.collabSphere_backend.repository;

import com.company.collabSphere_backend.entity.CollaborationRequest;
import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.CollaborationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest,Long> {

    Optional<CollaborationRequest> findByStudentAndProject(User student, Project project);
    List<CollaborationRequest> findByProject(Project project);
    List<CollaborationRequest> findByStudent(User student);

    // for student dashboard: get requests made by a student
    List<CollaborationRequest> findByStudentId(Long studentId);

    // for faculty dashboard: get requests for projects owned by faculty
    List<CollaborationRequest> findByProjectOwnerId(Long facultyId);

    // (optional) filter by status (Pending/Accepted/rejected)
    List<CollaborationRequest> findByProjectOwnerIdAndStatus(Long facultyId, CollaborationStatus status);


}
