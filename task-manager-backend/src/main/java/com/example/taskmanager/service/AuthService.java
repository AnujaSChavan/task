package com.example.taskmanager.service;

import com.example.taskmanager.dto.AuthDtos.*;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authManager;
	private final JwtService jwtService;
	private final EmailService emailService;

	public AuthService(UserRepository userRepository,
	                  PasswordEncoder passwordEncoder,
	                  AuthenticationManager authManager,
	                  JwtService jwtService,
	                  EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authManager = authManager;
		this.jwtService = jwtService;
		this.emailService = emailService;
	}

	public TokenResponse signup(SignupRequest request) {
		if (userRepository.existsByEmail(request.email)) {
			throw new IllegalArgumentException("Email already registered");
		}
		User user = new User();
		user.setName(request.name);
		user.setEmail(request.email);
		user.setPasswordHash(passwordEncoder.encode(request.password));
		user.setCreatedAt(Instant.now());
		user.setUpdatedAt(Instant.now());
		userRepository.save(user);

		emailService.sendWelcomeEmail(user.getEmail(), user.getName());
		return generateTokens(user.getEmail());
	}

	public TokenResponse login(LoginRequest request) {
		authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email, request.password));
		return generateTokens(request.email);
	}

	public TokenResponse refresh(RefreshRequest request) {
		String subject = jwtService.extractSubject(request.refreshToken);
		if (!jwtService.isTokenValid(request.refreshToken, subject)) {
			throw new IllegalArgumentException("Invalid refresh token");
		}
		String access = jwtService.generateAccessToken(subject, Map.of());
		return new TokenResponse(access, request.refreshToken);
	}

	public void requestPasswordReset(RequestPasswordResetRequest request) {
		Optional<User> maybe = userRepository.findByEmail(request.email);
		if (maybe.isEmpty()) return; // do not reveal
		User user = maybe.get();
		String token = UUID.randomUUID().toString();
		user.setResetToken(token);
		user.setResetTokenExpiry(Instant.now().plusSeconds(60 * 60));
		userRepository.save(user);
		emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
	}

	public void resetPassword(ResetPasswordRequest request) {
		User user = userRepository.findByResetToken(request.token)
				.orElseThrow(() -> new IllegalArgumentException("Invalid token"));
		if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(Instant.now())) {
			throw new IllegalArgumentException("Token expired");
		}
		user.setPasswordHash(passwordEncoder.encode(request.newPassword));
		user.setResetToken(null);
		user.setResetTokenExpiry(null);
		user.setUpdatedAt(Instant.now());
		userRepository.save(user);
	}

	public UserProfileResponse getProfile(String email) {
		User user = userRepository.findByEmail(email).orElseThrow();
		return new UserProfileResponse(user.getId(), user.getName(), user.getEmail());
	}

	public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
		User user = userRepository.findByEmail(email).orElseThrow();
		if (request.name != null && !request.name.isBlank()) user.setName(request.name);
		if (request.email != null && !request.email.isBlank() && !request.email.equals(user.getEmail())) {
			if (userRepository.existsByEmail(request.email)) {
				throw new IllegalArgumentException("Email already in use");
			}
			user.setEmail(request.email);
		}
		user.setUpdatedAt(Instant.now());
		userRepository.save(user);
		return new UserProfileResponse(user.getId(), user.getName(), user.getEmail());
	}

	private TokenResponse generateTokens(String subject) {
		Map<String, Object> claims = new HashMap<>();
		String access = jwtService.generateAccessToken(subject, claims);
		String refresh = jwtService.generateRefreshToken(subject, claims);
		return new TokenResponse(access, refresh);
	}
}


