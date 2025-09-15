package com.example.taskmanager.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notifications", indexes = {
		@Index(name = "idx_notification_user_created", columnList = "user_id,createdAt")
})
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String title;

	@Column(length = 1000)
	private String body;

	@Column(nullable = false)
	private boolean readFlag = false;

	@Column(nullable = false)
	private Instant createdAt = Instant.now();

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public User getUser() { return user; }
	public void setUser(User user) { this.user = user; }
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }
	public String getBody() { return body; }
	public void setBody(String body) { this.body = body; }
	public boolean isReadFlag() { return readFlag; }
	public void setReadFlag(boolean readFlag) { this.readFlag = readFlag; }
	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}


