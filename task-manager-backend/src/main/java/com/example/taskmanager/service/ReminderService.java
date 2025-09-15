package com.example.taskmanager.service;

import com.example.taskmanager.dto.ReminderDtos.*;
import com.example.taskmanager.model.Notification;
import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.NotificationRepository;
import com.example.taskmanager.repository.ReminderRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderService {
	private final ReminderRepository reminderRepository;
	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;
	private final EmailService emailService;

	public ReminderService(ReminderRepository reminderRepository, TaskRepository taskRepository, UserRepository userRepository, NotificationRepository notificationRepository, EmailService emailService) {
		this.reminderRepository = reminderRepository;
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
		this.notificationRepository = notificationRepository;
		this.emailService = emailService;
	}

	public ReminderResponse create(String userEmail, CreateReminderRequest request) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Task task = taskRepository.findById(request.taskId).orElseThrow();
		if (!task.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Task not found");
		Reminder r = new Reminder();
		r.setUser(user);
		r.setTask(task);
		r.setScheduledAt(request.scheduledAt);
		r.setMessage(request.message);
		r = reminderRepository.save(r);
		return toResponse(r);
	}

	public ReminderResponse update(String userEmail, Long id, UpdateReminderRequest request) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Reminder r = reminderRepository.findById(id).orElseThrow();
		if (!r.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Reminder not found");
		if (request.scheduledAt != null) r.setScheduledAt(request.scheduledAt);
		if (request.message != null) r.setMessage(request.message);
		r = reminderRepository.save(r);
		return toResponse(r);
	}

	public void delete(String userEmail, Long id) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Reminder r = reminderRepository.findById(id).orElseThrow();
		if (!r.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Reminder not found");
		reminderRepository.delete(r);
	}

	public List<ReminderResponse> listMine(String userEmail) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		return reminderRepository.findByUserIdOrderByScheduledAtDesc(user.getId()).stream().map(this::toResponse).collect(Collectors.toList());
	}

	// Called by scheduler to send due reminders
	public void sendDueReminders() {
		Instant now = Instant.now();
		List<Reminder> due = reminderRepository.findByScheduledAtBeforeAndSentIsFalse(now);
		for (Reminder r : due) {
			Task task = r.getTask();
			User user = r.getUser();
			String subject = "Reminder: " + task.getTitle();
			String body = (r.getMessage() == null ? "Don't forget your task" : r.getMessage());
			emailService.sendReminderEmail(user.getEmail(), subject, body);
			Notification n = new Notification();
			n.setUser(user);
			n.setTitle(subject);
			n.setBody(body);
			notificationRepository.save(n);
			r.setSent(true);
			reminderRepository.save(r);
		}
	}

	private ReminderResponse toResponse(Reminder r) {
		return new ReminderResponse(r.getId(), r.getTask().getId(), r.getScheduledAt(), r.isSent(), r.getMessage());
	}
}


