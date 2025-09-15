package com.example.taskmanager.dto;

import java.time.Instant;

public class ReminderDtos {
	public static class CreateReminderRequest {
		public Long taskId;
		public Instant scheduledAt;
		public String message;
	}
	public static class UpdateReminderRequest {
		public Instant scheduledAt;
		public String message;
	}
	public static class ReminderResponse {
		public Long id;
		public Long taskId;
		public Instant scheduledAt;
		public boolean sent;
		public String message;
		public ReminderResponse(Long id, Long taskId, Instant scheduledAt, boolean sent, String message) {
			this.id = id; this.taskId = taskId; this.scheduledAt = scheduledAt; this.sent = sent; this.message = message;
		}
	}
}


