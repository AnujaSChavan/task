package com.example.taskmanager.controller;

import com.example.taskmanager.model.Notification;
import com.example.taskmanager.repository.NotificationRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
		this.notificationRepository = notificationRepository;
		this.userRepository = userRepository;
	}

	@GetMapping
	public ResponseEntity<Page<Notification>> list(Authentication auth,
	                                             @RequestParam(defaultValue = "0") int page,
	                                             @RequestParam(defaultValue = "10") int size) {
		Long userId = userRepository.findByEmail(auth.getName()).orElseThrow().getId();
		return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size)));
	}

	@GetMapping("/unread-count")
	public ResponseEntity<Long> unreadCount(Authentication auth) {
		Long userId = userRepository.findByEmail(auth.getName()).orElseThrow().getId();
		return ResponseEntity.ok(notificationRepository.countByUserIdAndReadFlagIsFalse(userId));
	}

	@PostMapping("/{id}/read")
	public ResponseEntity<Void> markRead(Authentication auth, @PathVariable Long id) {
		Long userId = userRepository.findByEmail(auth.getName()).orElseThrow().getId();
		Notification n = notificationRepository.findById(id).orElseThrow();
		if (!n.getUser().getId().equals(userId)) return ResponseEntity.notFound().build();
		n.setReadFlag(true);
		notificationRepository.save(n);
		return ResponseEntity.ok().build();
	}
}


