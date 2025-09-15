package com.example.taskmanager.scheduler;

import com.example.taskmanager.service.ReminderService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {
	private final ReminderService reminderService;
	public ReminderScheduler(ReminderService reminderService) { this.reminderService = reminderService; }

	// Run every minute
	@Scheduled(fixedDelay = 60000)
	public void run() {
		reminderService.sendDueReminders();
	}
}


