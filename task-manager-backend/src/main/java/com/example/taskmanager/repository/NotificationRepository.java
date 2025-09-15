package com.example.taskmanager.repository;

import com.example.taskmanager.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
	long countByUserIdAndReadFlagIsFalse(Long userId);
}


