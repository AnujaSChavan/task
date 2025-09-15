package com.example.taskmanager.dto;

import com.example.taskmanager.model.Priority;
import com.example.taskmanager.model.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public class TaskDtos {
	public static class CreateTaskRequest {
		public String title;
		public String description;
		public Priority priority;
		public TaskStatus status;
		public LocalDate dueDate;
	}
	public static class UpdateTaskRequest {
		public String title;
		public String description;
		public Priority priority;
		public TaskStatus status;
		public LocalDate dueDate;
	}
	public static class SubtaskRequest {
		public String title;
		public String description;
		public TaskStatus status;
	}
	public static class TaskResponse {
		public Long id;
		public String title;
		public String description;
		public Priority priority;
		public TaskStatus status;
		public LocalDate dueDate;
		public List<SubtaskResponse> subtasks;
		public TaskResponse(Long id, String title, String description, Priority priority, TaskStatus status, LocalDate dueDate, List<SubtaskResponse> subtasks) {
			this.id = id; this.title = title; this.description = description; this.priority = priority; this.status = status; this.dueDate = dueDate; this.subtasks = subtasks;
		}
	}
	public static class SubtaskResponse {
		public Long id;
		public String title;
		public String description;
		public TaskStatus status;
		public SubtaskResponse(Long id, String title, String description, TaskStatus status) {
			this.id = id; this.title = title; this.description = description; this.status = status;
		}
	}
}


