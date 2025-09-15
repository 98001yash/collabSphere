package com.company.collabSphere_backend.config;

import com.company.collabSphere_backend.dtos.ProjectRequestDto;
import com.company.collabSphere_backend.dtos.ProjectResponseDto;
import com.company.collabSphere_backend.dtos.UserRequestDto;
import com.company.collabSphere_backend.dtos.UserResponseDto;
import com.company.collabSphere_backend.entity.Project;
import com.company.collabSphere_backend.entity.User;
import com.company.collabSphere_backend.utils.GeometryUtil;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();

        // User → UserResponseDto
        mapper.typeMap(User.class, UserResponseDto.class).addMappings(m -> {
            m.map(src -> GeometryUtil.getLatitude(src.getLocation()), UserResponseDto::setLatitude);
            m.map(src -> GeometryUtil.getLongitude(src.getLocation()), UserResponseDto::setLongitude);
        });

        // Project → ProjectResponseDto
        mapper.typeMap(Project.class, ProjectResponseDto.class).addMappings(m -> {
            m.map(src -> src.getOwner().getId(), ProjectResponseDto::setOwnerId);
            m.map(src -> src.getOwner().getName(), ProjectResponseDto::setOwnerName);
            m.map(src -> GeometryUtil.getLatitude(src.getLocation()), ProjectResponseDto::setLatitude);
            m.map(src -> GeometryUtil.getLongitude(src.getLocation()), ProjectResponseDto::setLongitude);
        });

        return mapper;
    }
}
