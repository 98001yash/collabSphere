package com.company.collabSphere_backend.repository;

import com.company.collabSphere_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
}
