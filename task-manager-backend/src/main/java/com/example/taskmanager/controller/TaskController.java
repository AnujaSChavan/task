package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskDtos.*;
import com.example.taskmanager.model.Priority;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.service.TaskService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
	private static final Logger logger = LoggerFactory.getLogger(TaskController.class);
	private final TaskService taskService;
	public TaskController(TaskService taskService) { this.taskService = taskService; }

	@PostMapping
	public ResponseEntity<TaskResponse> create(Authentication auth, @RequestBody CreateTaskRequest request) {
		logger.info("POST /api/tasks called");
		return ResponseEntity.ok(taskService.createTask(auth != null ? auth.getName() : "anonymous", request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TaskResponse> update(Authentication auth, @PathVariable Long id, @RequestBody UpdateTaskRequest request) {
		logger.info("PUT /api/tasks/{} called", id);
		return ResponseEntity.ok(taskService.updateTask(auth.getName(), id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
		logger.info("DELETE /api/tasks/{} called", id);
		taskService.deleteTask(auth.getName(), id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<TaskResponse> get(Authentication auth, @PathVariable Long id) {
		logger.info("GET /api/tasks/{} called", id);
		return ResponseEntity.ok(taskService.getTask(auth.getName(), id));
	}

	@GetMapping
	public ResponseEntity<Page<TaskResponse>> list(Authentication auth,
	                                             @RequestParam(required = false) Integer page,
	                                             @RequestParam(required = false) Integer size,
	                                             @RequestParam(required = false) String sortBy,
	                                             @RequestParam(required = false) String direction) {
		logger.info("GET /api/tasks called");
		return ResponseEntity.ok(taskService.listTasks(auth != null ? auth.getName() : "anonymous", page, size, sortBy, direction));
	}

	@GetMapping("/filter/status")
	public ResponseEntity<Page<TaskResponse>> filterStatus(Authentication auth,
	                                                     @RequestParam TaskStatus status,
	                                                     @RequestParam(required = false) Integer page,
	                                                     @RequestParam(required = false) Integer size) {
		logger.info("GET /api/tasks/filter/status called");
		return ResponseEntity.ok(taskService.filterByStatus(auth.getName(), status, page, size));
	}

	@GetMapping("/filter/priority")
	public ResponseEntity<Page<TaskResponse>> filterPriority(Authentication auth,
	                                                       @RequestParam Priority priority,
	                                                       @RequestParam(required = false) Integer page,
	                                                       @RequestParam(required = false) Integer size) {
		logger.info("GET /api/tasks/filter/priority called");
		return ResponseEntity.ok(taskService.filterByPriority(auth.getName(), priority, page, size));
	}

	@GetMapping("/due/today")
	public ResponseEntity<Page<TaskResponse>> dueToday(Authentication auth,
	                                                 @RequestParam(required = false) Integer page,
	                                                 @RequestParam(required = false) Integer size) {
		logger.info("GET /api/tasks/due/today called");
		return ResponseEntity.ok(taskService.dueToday(auth.getName(), page, size));
	}

	@GetMapping("/due/week")
	public ResponseEntity<Page<TaskResponse>> dueThisWeek(Authentication auth,
	                                                    @RequestParam(required = false) Integer page,
	                                                    @RequestParam(required = false) Integer size) {
		logger.info("GET /api/tasks/due/week called");
		return ResponseEntity.ok(taskService.dueThisWeek(auth.getName(), page, size));
	}

	@GetMapping("/calendar")
	public ResponseEntity<Page<TaskResponse>> byDate(Authentication auth,
	                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
	                                               @RequestParam(required = false) Integer page,
	                                               @RequestParam(required = false) Integer size) {
		logger.info("GET /api/tasks/calendar called");
		return ResponseEntity.ok(taskService.byDate(auth.getName(), date, page, size));
	}

	@PostMapping("/{id}/subtasks")
	public ResponseEntity<TaskResponse> addSubtask(Authentication auth, @PathVariable Long id, @RequestBody SubtaskRequest request) {
		logger.info("POST /api/tasks/{}/subtasks called", id);
		return ResponseEntity.ok(taskService.addSubtask(auth.getName(), id, request));
	}

	@PutMapping("/{id}/subtasks/{subtaskId}")
	public ResponseEntity<TaskResponse> updateSubtask(Authentication auth, @PathVariable Long id, @PathVariable Long subtaskId, @RequestBody SubtaskRequest request) {
		logger.info("PUT /api/tasks/{}/subtasks/{} called", id, subtaskId);
		return ResponseEntity.ok(taskService.updateSubtask(auth.getName(), id, subtaskId, request));
	}

	@DeleteMapping("/{id}/subtasks/{subtaskId}")
	public ResponseEntity<TaskResponse> deleteSubtask(Authentication auth, @PathVariable Long id, @PathVariable Long subtaskId) {
		logger.info("DELETE /api/tasks/{}/subtasks/{} called", id, subtaskId);
		return ResponseEntity.ok(taskService.deleteSubtask(auth.getName(), id, subtaskId));
	}
}


