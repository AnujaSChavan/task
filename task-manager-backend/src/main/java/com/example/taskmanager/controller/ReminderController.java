package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ReminderDtos.*;
import com.example.taskmanager.service.ReminderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
	private final ReminderService reminderService;
	public ReminderController(ReminderService reminderService) { this.reminderService = reminderService; }

	@PostMapping
	public ResponseEntity<ReminderResponse> create(Authentication auth, @RequestBody CreateReminderRequest request) {
		return ResponseEntity.ok(reminderService.create(auth.getName(), request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ReminderResponse> update(Authentication auth, @PathVariable Long id, @RequestBody UpdateReminderRequest request) {
		return ResponseEntity.ok(reminderService.update(auth.getName(), id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
		reminderService.delete(auth.getName(), id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public ResponseEntity<List<ReminderResponse>> list(Authentication auth) {
		return ResponseEntity.ok(reminderService.listMine(auth.getName()));
	}
}


