package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskDtos.*;
import com.example.taskmanager.model.*;
import com.example.taskmanager.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
	private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
	private final TaskRepository taskRepository;
	private final UserRepository userRepository;
	private final SubtaskRepository subtaskRepository;

	public TaskService(TaskRepository taskRepository, UserRepository userRepository, SubtaskRepository subtaskRepository) {
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
		this.subtaskRepository = subtaskRepository;
	}

	public TaskResponse createTask(String userEmail, CreateTaskRequest request) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Task task = new Task();
		task.setUser(user);
		task.setTitle(request.title);
		task.setDescription(request.description);
		task.setPriority(request.priority == null ? Priority.MEDIUM : request.priority);
		task.setStatus(request.status == null ? TaskStatus.PENDING : request.status);
		task.setDueDate(request.dueDate);
		task = taskRepository.save(task);
		return toResponse(task);
	}

	public TaskResponse updateTask(String userEmail, Long taskId, UpdateTaskRequest request) {
		Task task = taskRepository.findById(taskId).orElseThrow();
		if (request.title != null) task.setTitle(request.title);
		if (request.description != null) task.setDescription(request.description);
		if (request.priority != null) task.setPriority(request.priority);
		if (request.status != null) {
			task.setStatus(request.status);
			if (request.status == TaskStatus.COMPLETED && task.getCompletedAt() == null) {
				task.setCompletedAt(Instant.now());
			}
		}
		if (request.dueDate != null) task.setDueDate(request.dueDate);
		task = taskRepository.save(task);
		return toResponse(task);
	}

	public void deleteTask(String userEmail, Long taskId) {
		Task task = taskRepository.findById(taskId).orElseThrow();
		taskRepository.delete(task);
	}

	public TaskResponse getTask(String userEmail, Long taskId) {
		Task task = taskRepository.findWithSubtasksById(taskId);
		if (task == null) task = taskRepository.findById(taskId).orElseThrow();
		return toResponse(task);
	}

	public Page<TaskResponse> listTasks(String userEmail, Integer page, Integer size, String sortBy, String direction) {
		logger.info("listTasks called by user: {}", userEmail);
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		List<Task> tasks = taskRepository.findAllWithSubtasksByUserId(user.getId());
		List<TaskResponse> dtos = tasks.stream().map(this::toResponse).collect(Collectors.toList());
		int p = page == null ? 0 : page;
		int s = size == null ? 10 : size;
		int start = Math.min(p * s, dtos.size());
		int end = Math.min(start + s, dtos.size());
		return new PageImpl<>(dtos.subList(start, end), PageRequest.of(p, s), dtos.size());
	}

	public Page<TaskResponse> filterByStatus(String userEmail, TaskStatus status, Integer page, Integer size) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
		return taskRepository.findByUserIdAndStatus(user.getId(), status, pageable).map(this::toResponse);
	}

	public Page<TaskResponse> filterByPriority(String userEmail, Priority priority, Integer page, Integer size) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
		return taskRepository.findByUserIdAndPriority(user.getId(), priority, pageable).map(this::toResponse);
	}

	public Page<TaskResponse> dueToday(String userEmail, Integer page, Integer size) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		LocalDate today = LocalDate.now();
		Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
		return taskRepository.findByUserIdAndDueDate(user.getId(), today, pageable).map(this::toResponse);
	}

	public Page<TaskResponse> dueThisWeek(String userEmail, Integer page, Integer size) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		LocalDate today = LocalDate.now();
		LocalDate start = today.minusDays(today.getDayOfWeek().getValue() - 1);
		LocalDate end = start.plusDays(6);
		Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
		return taskRepository.findByUserIdAndDueDateBetween(user.getId(), start, end, pageable).map(this::toResponse);
	}

	public Page<TaskResponse> byDate(String userEmail, LocalDate date, Integer page, Integer size) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 10 : size);
		return taskRepository.findByUserIdAndDueDate(user.getId(), date, pageable).map(this::toResponse);
	}

	public TaskResponse addSubtask(String userEmail, Long taskId, SubtaskRequest request) {
		logger.info("addSubtask called for taskId: {} by user: {}", taskId, userEmail);
		Task task = getOwnedTask(userEmail, taskId);
		Subtask st = new Subtask();
		st.setTask(task);
		st.setTitle(request.title);
		st.setDescription(request.description);
		st.setStatus(request.status == null ? TaskStatus.PENDING : request.status);
		subtaskRepository.save(st);
		return toResponse(taskRepository.findById(taskId).orElseThrow());
	}

	public TaskResponse updateSubtask(String userEmail, Long taskId, Long subtaskId, SubtaskRequest request) {
		Task task = getOwnedTask(userEmail, taskId);
		Subtask st = subtaskRepository.findById(subtaskId).orElseThrow();
		if (!st.getTask().getId().equals(task.getId())) throw new IllegalArgumentException("Subtask not in task");
		if (request.title != null) st.setTitle(request.title);
		if (request.description != null) st.setDescription(request.description);
		if (request.status != null) st.setStatus(request.status);
		subtaskRepository.save(st);
		return toResponse(taskRepository.findById(taskId).orElseThrow());
	}

	public TaskResponse deleteSubtask(String userEmail, Long taskId, Long subtaskId) {
		Task task = getOwnedTask(userEmail, taskId);
		Subtask st = subtaskRepository.findById(subtaskId).orElseThrow();
		if (!st.getTask().getId().equals(task.getId())) throw new IllegalArgumentException("Subtask not in task");
		subtaskRepository.delete(st);
		return toResponse(taskRepository.findById(taskId).orElseThrow());
	}

	private Task getOwnedTask(String userEmail, Long taskId) {
		User user = userRepository.findByEmail(userEmail).orElseThrow();
		Task task = taskRepository.findById(taskId).orElseThrow();
		if (!task.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("Task not found");
		return task;
	}

	private TaskResponse toResponse(Task task) {
		List<SubtaskResponse> subs = task.getSubtasks().stream()
				.map(s -> new SubtaskResponse(s.getId(), s.getTitle(), s.getDescription(), s.getStatus()))
				.collect(Collectors.toList());
		return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getPriority(), task.getStatus(), task.getDueDate(), subs);
	}
}
