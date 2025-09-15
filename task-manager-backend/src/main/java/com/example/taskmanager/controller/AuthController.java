package com.example.taskmanager.controller;

import com.example.taskmanager.dto.AuthDtos.*;
import com.example.taskmanager.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
	private final AuthService authService;
	public AuthController(AuthService authService) { this.authService = authService; }

	@PostMapping("/signup")
	public ResponseEntity<TokenResponse> signup(@RequestBody SignupRequest request) {
		logger.info("POST /api/auth/signup called");
		return ResponseEntity.ok(authService.signup(request));
	}

	@PostMapping("/login")
	public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
		logger.info("POST /api/auth/login called");
		return ResponseEntity.ok(authService.login(request));
	}

	@PostMapping("/refresh")
	public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
		return ResponseEntity.ok(authService.refresh(request));
	}

	@PostMapping("/request-reset")
	public ResponseEntity<Void> requestReset(@RequestBody RequestPasswordResetRequest request) {
		authService.requestPasswordReset(request);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/reset-password")
	public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
		authService.resetPassword(request);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/me")
	public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
		return ResponseEntity.ok(authService.getProfile(authentication.getName()));
	}

	@PutMapping("/me")
	public ResponseEntity<UserProfileResponse> update(Authentication authentication, @RequestBody UpdateProfileRequest request) {
		return ResponseEntity.ok(authService.updateProfile(authentication.getName(), request));
	}
}


