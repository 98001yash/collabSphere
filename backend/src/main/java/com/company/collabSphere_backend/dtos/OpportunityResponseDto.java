package com.company.collabSphere_backend.dtos;


import com.company.collabSphere_backend.enums.OpportunityStatus;
import com.company.collabSphere_backend.enums.OpportunityType;
import com.company.collabSphere_backend.enums.WorkMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpportunityResponseDto {

    private Long id;

    private String title;
    private String description;

    private OpportunityType type;
    private WorkMode mode;

    private OpportunityStatus status;

    private String organization;

    private BigDecimal stipendMin;
    private BigDecimal stipendMax;

    private LocalDate startDate;
    private LocalDate endDate;

    private LocalDateTime applicationDeadline;

    private Double latitude;
    private Double longitude;

    private Long createdById;
    private String createdByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
