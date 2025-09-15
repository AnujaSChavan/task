package com.example.taskmanager.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "reminders", indexes = {
		@Index(name = "idx_reminder_time", columnList = "scheduledAt")
})
public class Reminder {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "task_id", nullable = false)
	private Task task;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private Instant scheduledAt;

	@Column(nullable = false)
	private boolean sent = false;

	@Column(length = 500)
	private String message;

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Task getTask() { return task; }
	public void setTask(Task task) { this.task = task; }
	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }
	public Instant getScheduledAt() { return scheduledAt; }
	public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
	public boolean isSent() { return sent; }
	public void setSent(boolean sent) { this.sent = sent; }
	public String getMessage() { return message; }
	public void setMessage(String message) { this.message = message; }
}


