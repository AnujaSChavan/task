package com.example.taskmanager.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks", indexes = {
		@Index(name = "idx_task_user_due", columnList = "user_id,dueDate"),
		@Index(name = "idx_task_status", columnList = "status")
})
public class Task {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String title;

	@Column(length = 2000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Priority priority = Priority.MEDIUM;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TaskStatus status = TaskStatus.PENDING;

	private LocalDate dueDate;

	@OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Subtask> subtasks = new ArrayList<>();

	@OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Reminder> reminders = new ArrayList<>();

	private Instant createdAt = Instant.now();
	private Instant updatedAt = Instant.now();

	// When the task is marked COMPLETED, record the timestamp
	private Instant completedAt;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public Priority getPriority() { return priority; }
	public void setPriority(Priority priority) { this.priority = priority; }
	public TaskStatus getStatus() { return status; }
	public void setStatus(TaskStatus status) { this.status = status; }
	public LocalDate getDueDate() { return dueDate; }
	public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
	public List<Subtask> getSubtasks() { return subtasks; }
	public void setSubtasks(List<Subtask> subtasks) { this.subtasks = subtasks; }
	public List<Reminder> getReminders() { return reminders; }
	public void setReminders(List<Reminder> reminders) { this.reminders = reminders; }
	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
