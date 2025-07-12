package com.projects.backend.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projects.backend.dto.LoginRequest;
import com.projects.backend.dto.TokenResponse;
import com.projects.backend.dto.RegisterRequest;
import com.projects.backend.model.User;
import com.projects.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        TokenResponse tokenResponse = authService.authenticateAndGetTokens(request);
        
        // Add refresh token as HTTP-only cookie
        Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true); // for HTTPS
        refreshTokenCookie.setPath("/api/auth");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(refreshTokenCookie);
        
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            TokenResponse tokenResponse = authService.refreshToken(refreshToken);
            
            // Update refresh token cookie
            Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/api/auth");
            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(refreshTokenCookie);
            
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletResponse response) {
        
        // Extract access token from Authorization header
        String accessToken = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.substring(7);
        }

        // Invalidate tokens in the blacklist
        authService.logout(refreshToken, accessToken);

        // Delete refresh token cookie
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return ResponseEntity.ok().build();
    }
}
