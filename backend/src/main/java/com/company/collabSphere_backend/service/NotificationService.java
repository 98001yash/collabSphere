package com.company.collabSphere_backend.service;


import com.company.collabSphere_backend.entity.Notification;
import com.company.collabSphere_backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // create the notification ans save it
    public Notification createNotification(Long userId, String type,String message, Long relatedEntityId){
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setStatus("UNREAD");
        return notificationRepository.save(notification);
    }


    // get All notification for a user
    public List<Notification> getNotificationForUser(Long userId){
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    //Mark a notification as read
    public Notification markAsRead(Long notificationId){
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setStatus("READ");
        return notificationRepository.save(notification);
    }
}
