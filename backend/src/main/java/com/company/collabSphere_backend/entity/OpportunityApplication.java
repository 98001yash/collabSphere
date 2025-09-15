package com.company.collabSphere_backend.entity;

import com.company.collabSphere_backend.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "opportunity_applications",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_student_opportunity",
                columnNames = {"student_id", "opportunity_id"}
        ),
        indexes = {
                @Index(name = "idx_app_opportunity", columnList = "opportunity_id"),
                @Index(name = "idx_app_student", columnList = "student_id"),
                @Index(name = "idx_app_status", columnList = "status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpportunityApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime appliedAt;
}
