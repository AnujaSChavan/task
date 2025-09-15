	package com.example.taskmanager.repository;

import com.example.taskmanager.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.Instant;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
	Page<Task> findByUserId(Long userId, Pageable pageable);
	Page<Task> findByUserIdAndStatus(Long userId, TaskStatus status, Pageable pageable);
	Page<Task> findByUserIdAndPriority(Long userId, Priority priority, Pageable pageable);
	Page<Task> findByUserIdAndDueDate(Long userId, LocalDate dueDate, Pageable pageable);
	Page<Task> findByUserIdAndDueDateBetween(Long userId, LocalDate start, LocalDate end, Pageable pageable);

	// Analytics helpers
	long countByUserId(Long userId);
	long countByUserIdAndStatus(Long userId, TaskStatus status);

	@Query("SELECT DATE(t.completedAt) as day, COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.completedAt IS NOT NULL AND t.completedAt >= :since GROUP BY DATE(t.completedAt) ORDER BY day")
	List<Object[]> completedPerDaySince(Long userId, Instant since);

	@Query("SELECT t.priority, COUNT(t) FROM Task t WHERE t.user.id = :userId GROUP BY t.priority")
	List<Object[]> priorityDistribution(Long userId);
	@Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.subtasks WHERE t.user.id = :userId")
	List<Task> findAllWithSubtasksByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

	@Query("SELECT t FROM Task t LEFT JOIN FETCH t.subtasks WHERE t.id = :taskId")
	Task findWithSubtasksById(@org.springframework.data.repository.query.Param("taskId") Long taskId);
}
