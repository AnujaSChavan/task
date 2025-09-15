package com.example.taskmanager.service;

import com.example.taskmanager.dto.AnalyticsDtos.*;
import com.example.taskmanager.model.Priority;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
	private final TaskRepository taskRepository;
	private final UserRepository userRepository;

	public AnalyticsService(TaskRepository taskRepository, UserRepository userRepository) {
		this.taskRepository = taskRepository;
		this.userRepository = userRepository;
	}

	public CountersResponse counters(String email) {
		Long userId = userRepository.findByEmail(email).orElseThrow().getId();
		CountersResponse r = new CountersResponse();
		r.totalTasks = taskRepository.countByUserId(userId);
		r.completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
		r.incompleteTasks = r.totalTasks - r.completedTasks;
		Map<Priority, Long> byPriority = taskRepository.priorityDistribution(userId).stream()
				.collect(Collectors.toMap(o -> (Priority) o[0], o -> (Long) o[1]));
		r.highPriority = byPriority.getOrDefault(Priority.HIGH, 0L);
		r.mediumPriority = byPriority.getOrDefault(Priority.MEDIUM, 0L);
		r.lowPriority = byPriority.getOrDefault(Priority.LOW, 0L);
		return r;
	}

	public CompletedPerDayResponse completedPerDay(String email, int days) {
		Long userId = userRepository.findByEmail(email).orElseThrow().getId();
		Instant since = Instant.now().minusSeconds(86400L * days);
		List<Object[]> rows = taskRepository.completedPerDaySince(userId, since);
		List<CompletedPerDayItem> items = new ArrayList<>();
		for (Object[] row : rows) {
			java.sql.Date sqlDate = (java.sql.Date) row[0];
			LocalDate day = sqlDate.toLocalDate();
			long count = (Long) row[1];
			items.add(new CompletedPerDayItem(day, count));
		}
		return new CompletedPerDayResponse(items);
	}

	public CompletionRateResponse completionRate(String email) {
		Long userId = userRepository.findByEmail(email).orElseThrow().getId();
		long total = taskRepository.countByUserId(userId);
		long completed = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
		CompletionRateResponse r = new CompletionRateResponse();
		r.completionRate = total == 0 ? 0 : (completed * 100.0) / total;
		return r;
	}

	public StreaksResponse dailyStreaks(String email, int windowDays) {
		List<CompletedPerDayItem> items = completedPerDay(email, windowDays).items;
		Set<LocalDate> set = items.stream().map(i -> i.day).collect(Collectors.toSet());
		LocalDate today = LocalDate.now(ZoneId.systemDefault());
		int current = 0, best = 0;
		int count = 0;
		for (int i = 0; i < windowDays; i++) {
			LocalDate d = today.minusDays(i);
			if (set.contains(d)) {
				count++;
				current = i == 0 ? count : current; // only set current if starting from today
				best = Math.max(best, count);
			} else {
				count = 0;
			}
		}
		StreaksResponse r = new StreaksResponse();
		r.currentDailyStreak = current;
		r.bestDailyStreak = best;
		return r;
	}
}


