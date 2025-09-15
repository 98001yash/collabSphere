package com.company.collabSphere_backend.entity;

import com.company.collabSphere_backend.enums.OpportunityStatus;
import com.company.collabSphere_backend.enums.OpportunityType;
import com.company.collabSphere_backend.enums.WorkMode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "opportunities",
        indexes = {
                @Index(name = "idx_opp_status", columnList = "status"),
                @Index(name = "idx_opp_type", columnList = "type"),
                @Index(name = "idx_opp_deadline", columnList = "applicationDeadline")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition="TEXT")
    private String description;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OpportunityType type;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkMode mode;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OpportunityStatus status;

    @Column(nullable = false)
    private String organization;

    @Column(precision = 12, scale = 2)
    private BigDecimal stipendMin;

    @Column(precision = 12, scale = 2)
    private BigDecimal stipendMax;


    private LocalDate startDate;
    private LocalDate endDate;

    private LocalDateTime applicationDeadline;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
