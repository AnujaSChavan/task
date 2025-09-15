package com.example.taskmanager.model;

import jakarta.persistence.*;

@Entity
@Table(name = "subtasks")
public class Subtask {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "task_id", nullable = false)
	private Task task;

	@Column(nullable = false)
	private String title;

	@Column(length = 1000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TaskStatus status = TaskStatus.PENDING;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Task getTask() { return task; }
	public void setTask(Task task) { this.task = task; }
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }
	public String getDescription() { return description; }
	public void setDescription(String description) { this.description = description; }
	public TaskStatus getStatus() { return status; }
	public void setStatus(TaskStatus status) { this.status = status; }
}


