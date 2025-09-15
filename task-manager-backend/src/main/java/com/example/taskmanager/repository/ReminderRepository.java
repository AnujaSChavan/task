package com.example.taskmanager.repository;

import com.example.taskmanager.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
	List<Reminder> findByScheduledAtBeforeAndSentIsFalse(Instant now);
	List<Reminder> findByUserIdOrderByScheduledAtDesc(Long userId);
}


