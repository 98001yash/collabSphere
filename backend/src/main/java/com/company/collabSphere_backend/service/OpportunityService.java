package com.company.collabSphere_backend.service;


import com.company.collabSphere_backend.dtos.OpportunityRequestDto;
import com.company.collabSphere_backend.dtos.OpportunityResponseDto;
import com.company.collabSphere_backend.entity.Opportunity;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.enums.OpportunityStatus;
import com.company.collabSphere_backend.exceptions.ResourceNotFoundException;
import com.company.collabSphere_backend.repository.OpportunityRepository;
import com.company.collabSphere_backend.repository.UserRepository;
import com.company.collabSphere_backend.utils.GeometryUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Transactional
    public OpportunityResponseDto createOpportunity(OpportunityRequestDto requestDto) {
        log.info("Creating new opportunity: {}", requestDto.getTitle());

        Opportunity opportunity = new Opportunity();
        opportunity.setTitle(requestDto.getTitle());
        opportunity.setDescription(requestDto.getDescription());
        opportunity.setType(requestDto.getType());
        opportunity.setMode(requestDto.getMode());
        opportunity.setOrganization(requestDto.getOrganization());
        opportunity.setStipendMin(requestDto.getStipendMin());
        opportunity.setStipendMax(requestDto.getStipendMax());
        opportunity.setStartDate(requestDto.getStartDate());
        opportunity.setEndDate(requestDto.getEndDate());
        opportunity.setApplicationDeadline(requestDto.getApplicationDeadline());
        opportunity.setStatus(OpportunityStatus.DRAFT);

        if (requestDto.getLatitude() != null && requestDto.getLongitude() != null) {
            opportunity.setLocation(GeometryUtil.createPoint(requestDto.getLatitude(), requestDto.getLongitude()));
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        opportunity.setCreatedBy(creator);
        Opportunity saved = opportunityRepository.save(opportunity);
        return mapToDto(saved);
    }




    @Transactional
    public OpportunityResponseDto publishOpportunity(Long id) {
        log.info("Publishing opportunity with id: {}", id);


        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id " + id));

        opportunity.setStatus(OpportunityStatus.PUBLISHED);

        Opportunity saved = opportunityRepository.save(opportunity);
        OpportunityResponseDto dto = modelMapper.map(saved, OpportunityResponseDto.class);
        if (saved.getLocation() != null) {
            dto.setLatitude(saved.getLocation().getY()); // latitude
            dto.setLongitude(saved.getLocation().getX()); // longitude
        }

        return dto;
    }


    public List<OpportunityResponseDto> getActiveOpportunities() {
        log.info("Fetching all active opportunities");

        return opportunityRepository.findByStatusAndApplicationDeadlineAfter(
                        OpportunityStatus.PUBLISHED,
                        LocalDateTime.now()
                )
                .stream()
                .map(op -> modelMapper.map(op, OpportunityResponseDto.class))
                .collect(Collectors.toList());
    }

    public OpportunityResponseDto getOpportunityById(Long id) {
        log.info("Fetching opportunity with id {}", id);

        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id " + id));

        return modelMapper.map(opportunity, OpportunityResponseDto.class);
    }

    public void deleteOpportunity(Long id) {
        log.info("Deleting opportunity with id {}", id);

        if (!opportunityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Opportunity not found with id " + id);
        }
        opportunityRepository.deleteById(id);
    }


    private OpportunityResponseDto mapToDto(Opportunity opportunity) {
        OpportunityResponseDto dto = modelMapper.map(opportunity, OpportunityResponseDto.class);

        if (opportunity.getLocation() != null) {
            dto.setLatitude(opportunity.getLocation().getY()); // Y = latitude
            dto.setLongitude(opportunity.getLocation().getX()); // X = longitude
        }

        dto.setCreatedById(opportunity.getCreatedBy().getId());
        dto.setCreatedByName(opportunity.getCreatedBy().getName());

        return dto;
    }

}
