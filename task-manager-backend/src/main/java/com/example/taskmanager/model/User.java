package com.example.taskmanager.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String passwordHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role = Role.USER;

	private String resetToken;
	private Instant resetTokenExpiry;

	private Instant createdAt = Instant.now();
	private Instant updatedAt = Instant.now();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Task> tasks = new HashSet<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Notification> notifications = new HashSet<>();

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getPasswordHash() { return passwordHash; }
	public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
	public Role getRole() { return role; }
	public void setRole(Role role) { this.role = role; }
	public String getResetToken() { return resetToken; }
	public void setResetToken(String resetToken) { this.resetToken = resetToken; }
	public Instant getResetTokenExpiry() { return resetTokenExpiry; }
	public void setResetTokenExpiry(Instant resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }
	public Instant getCreatedAt() { return createdAt; }
	public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
	public Instant getUpdatedAt() { return updatedAt; }
	public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
	public Set<Task> getTasks() { return tasks; }
	public void setTasks(Set<Task> tasks) { this.tasks = tasks; }
	public Set<Notification> getNotifications() { return notifications; }
	public void setNotifications(Set<Notification> notifications) { this.notifications = notifications; }
}


