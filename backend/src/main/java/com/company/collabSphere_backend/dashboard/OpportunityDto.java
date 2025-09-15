package com.company.collabSphere_backend.dashboard;

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
public class OpportunityDto {
    private Long id;
    private String title;
    private String type;
    private String mode;
    private String organization;
    private BigDecimal stipendMin;
    private BigDecimal stipendMax;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime applicationDeadline;
    private Double latitude;
    private Double longitude;
}