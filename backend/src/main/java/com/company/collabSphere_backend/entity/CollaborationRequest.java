package com.company.collabSphere_backend.entity;


import com.company.collabSphere_backend.enums.CollaborationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "collaboration_requests",
        uniqueConstraints = {

                @UniqueConstraint(name = "uq_project_student", columnNames = {"project_id", "student_id"})
        },
        indexes = {
                @Index(name = "idx_collab_project", columnList = "project_id"),
                @Index(name = "idx_collab_student", columnList = "student_id"),
                @Index(name = "idx_collab_status", columnList = "status")
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollaborationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // who wants to join
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // which project to join
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CollaborationStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
