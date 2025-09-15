package com.company.collabSphere_backend.dtos;


import com.company.collabSphere_backend.enums.OpportunityType;
import com.company.collabSphere_backend.enums.WorkMode;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class OpportunityRequestDto {

    @NotBlank
    private String title;
    private String description;

    @NotNull
    private OpportunityType type;

    @NotNull
    private WorkMode mode;

    @NotBlank
    private String organization;

    private BigDecimal stipendMin;

    private BigDecimal stipendMax;

    private LocalDate startDate;
    private LocalDate endDate;

    @FutureOrPresent
    private LocalDateTime applicationDeadline;

    private Double latitude;
    private Double longitude;
}
