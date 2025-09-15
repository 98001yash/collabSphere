package com.company.collabSphere_backend.controller;


import com.company.collabSphere_backend.entity.Notification;
import com.company.collabSphere_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/")
    public Notification createNotification(
            @RequestParam Long userId,
            @RequestParam String type,
            @RequestParam String message,
            @RequestParam Long relatedEntityId
    ) {
        return notificationService.createNotification(userId, type, message, relatedEntityId);
    }


    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsForUser(@PathVariable Long userId){
        return notificationService.getNotificationForUser(userId);
    }

    // Mark the notification as READ
    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(@PathVariable Long notificationId){
        return notificationService.markAsRead(notificationId);
    }

}
