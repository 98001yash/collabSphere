package com.company.collabSphere_backend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name= "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;

    private String type;

    @Column(length = 1000)
    private String message;


    private String status  = "UNREAD"; // UNREAD OR READ
    private Long relatedEntityId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private Boolean emailSent = false;
}
