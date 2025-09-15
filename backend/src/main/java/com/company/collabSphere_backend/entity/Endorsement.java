package com.company.collabSphere_backend.entity;


import com.company.collabSphere_backend.enums.EndorsementStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "endorsements")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Endorsement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private User faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 500)
    private String feedback;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EndorsementStatus status = EndorsementStatus.ENDORSED;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @ManyToOne
    private User student;


}
