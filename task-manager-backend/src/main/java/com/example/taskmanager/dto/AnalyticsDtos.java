package com.example.taskmanager.dto;

import java.time.LocalDate;
import java.util.List;

public class AnalyticsDtos {
	public static class CountersResponse {
		public long totalTasks;
		public long completedTasks;
		public long incompleteTasks;
		public long highPriority;
		public long mediumPriority;
		public long lowPriority;
	}
	public static class CompletedPerDayItem {
		public LocalDate day;
		public long count;
		public CompletedPerDayItem(LocalDate day, long count) { this.day = day; this.count = count; }
	}
	public static class CompletedPerDayResponse {
		public List<CompletedPerDayItem> items;
		public CompletedPerDayResponse(List<CompletedPerDayItem> items) { this.items = items; }
	}
	public static class StreaksResponse {
		public int currentDailyStreak;
		public int bestDailyStreak;
	}
	public static class CompletionRateResponse {
		public double completionRate; // 0-100
	}
}


