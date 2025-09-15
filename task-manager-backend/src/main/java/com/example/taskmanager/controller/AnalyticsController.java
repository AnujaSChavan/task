package com.example.taskmanager.controller;

import com.example.taskmanager.dto.AnalyticsDtos.*;
import com.example.taskmanager.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
	private final AnalyticsService analyticsService;
	public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

	@GetMapping("/counters")
	public ResponseEntity<CountersResponse> counters(Authentication auth) {
		return ResponseEntity.ok(analyticsService.counters(auth.getName()));
	}

	@GetMapping("/completion-rate")
	public ResponseEntity<CompletionRateResponse> completionRate(Authentication auth) {
		return ResponseEntity.ok(analyticsService.completionRate(auth.getName()));
	}

	@GetMapping("/completed-per-day")
	public ResponseEntity<CompletedPerDayResponse> completedPerDay(Authentication auth, @RequestParam(defaultValue = "7") int days) {
		return ResponseEntity.ok(analyticsService.completedPerDay(auth.getName(), days));
	}

	@GetMapping("/streaks")
	public ResponseEntity<StreaksResponse> streaks(Authentication auth, @RequestParam(defaultValue = "30") int windowDays) {
		return ResponseEntity.ok(analyticsService.dailyStreaks(auth.getName(), windowDays));
	}
}


