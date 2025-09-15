package com.example.taskmanager.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Map;

/**
 * JwtService encapsulates creation and validation of access and refresh JWTs.
 */
@Service
public class JwtService {
	private final Key signingKey;
	private final long accessExpirationMs;
	private final long refreshExpirationMs;

	public JwtService(
			@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.access-expiration-ms}") long accessExpirationMs,
			@Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationMs
	) {
		this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(ensureBase64(secret)));
		this.accessExpirationMs = accessExpirationMs;
		this.refreshExpirationMs = refreshExpirationMs;
	}

	private String ensureBase64(String secret) {
		// If not base64, fall back to raw bytes encoding as base64
		try {
			Decoders.BASE64.decode(secret);
			return secret;
		} catch (IllegalArgumentException ex) {
			return io.jsonwebtoken.io.Encoders.BASE64.encode(secret.getBytes());
		}
	}

	public String generateAccessToken(String subject, Map<String, Object> claims) {
		return generateToken(subject, claims, accessExpirationMs);
	}

	public String generateRefreshToken(String subject, Map<String, Object> claims) {
		return generateToken(subject, claims, refreshExpirationMs);
	}

	private String generateToken(String subject, Map<String, Object> claims, long expirationMs) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expirationMs);
		return Jwts.builder()
				.setClaims(claims)
				.setSubject(subject)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(signingKey, SignatureAlgorithm.HS256)
				.compact();
	}

	public boolean isTokenValid(String token, String subject) {
		try {
			String tokenSubject = extractSubject(token);
			return subject.equals(tokenSubject) && !isTokenExpired(token);
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	public String extractSubject(String token) {
		return parse(token).getBody().getSubject();
	}

	public boolean isTokenExpired(String token) {
		Date expiration = parse(token).getBody().getExpiration();
		return expiration.before(new Date());
	}

	private Jws<Claims> parse(String token) {
		return Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token);
	}
}


