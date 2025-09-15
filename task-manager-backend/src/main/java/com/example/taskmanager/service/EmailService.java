package com.example.taskmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	private final JavaMailSender mailSender;
	private final String from;
	private final String frontendResetUrl;

	public EmailService(JavaMailSender mailSender,
	                   @Value("${app.mail.from}") String from,
	                   @Value("${app.frontend.reset-url}") String frontendResetUrl) {
		this.mailSender = mailSender;
		this.from = from;
		this.frontendResetUrl = frontendResetUrl;
	}

	public void sendWelcomeEmail(String to, String name) {
		String subject = "Welcome to Task Manager";
		String text = "Hi " + name + ",\n\nWelcome to Task Manager! You're all set to boost your productivity.";
		send(to, subject, text);
	}

	public void sendPasswordResetEmail(String to, String name, String token) {
		String subject = "Reset your Task Manager password";
		String link = frontendResetUrl + "?token=" + token;
		String text = "Hi " + name + ",\n\nWe received a request to reset your password.\nUse this link: " + link + "\nIf you didn't request this, ignore this email.";
		send(to, subject, text);
	}

	public void sendReminderEmail(String to, String subject, String message) {
		send(to, subject, message);
	}

	private void send(String to, String subject, String text) {
		SimpleMailMessage msg = new SimpleMailMessage();
		msg.setFrom(from);
		msg.setTo(to);
		msg.setSubject(subject);
		msg.setText(text);
		mailSender.send(msg);
	}
}


