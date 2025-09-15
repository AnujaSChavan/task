package com.example.taskmanager.dto;

public class AuthDtos {
	public static class SignupRequest {
		public String name;
		public String email;
		public String password;
	}
	public static class LoginRequest {
		public String email;
		public String password;
	}
	public static class TokenResponse {
		public String accessToken;
		public String refreshToken;
		public TokenResponse(String accessToken, String refreshToken) {
			this.accessToken = accessToken;
			this.refreshToken = refreshToken;
		}
	}
	public static class RefreshRequest {
		public String refreshToken;
	}
	public static class RequestPasswordResetRequest {
		public String email;
	}
	public static class ResetPasswordRequest {
		public String token;
		public String newPassword;
	}
	public static class UpdateProfileRequest {
		public String name;
		public String email;
	}
	public static class UserProfileResponse {
		public Long id;
		public String name;
		public String email;
		public UserProfileResponse(Long id, String name, String email) {
			this.id = id; this.name = name; this.email = email;
		}
	}
}


