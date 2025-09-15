package com.example.taskmanager.repository;

import com.example.taskmanager.model.Subtask;
import com.example.taskmanager.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
	List<Subtask> findByTaskId(Long taskId);
	long countByTaskIdAndStatus(Long taskId, TaskStatus status);
}


