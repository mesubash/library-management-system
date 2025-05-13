package com.projects.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projects.backend.model.User;
import com.projects.backend.service.JWTService;
import com.projects.backend.service.UserService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final UserService userService;
    private final JWTService jwtService;
    private final StringRedisTemplate redisTemplate;

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public AuthController(UserService userService, JWTService jwtService, StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Validate user input
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username cannot be null or empty");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password cannot be null or empty");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email cannot be null or empty");
        }

        // Encrypt password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // Register the user
        try {
            User registeredUser = userService.register(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("user", registeredUser);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Handle cases like "Username already exists"
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        System.out.println("here in login method");
        System.out.println("Received Identifier: " + user.getIdentifier());

        // Determine the username from identifier
        String identifier = user.getIdentifier();
        if (identifier.contains("@")) {
            user.setUsername(userService.getUsernameByEmail(identifier)); // Convert email to username
        } else if (identifier.matches("\\d+")) {
            user.setUsername(userService.getUsernameByPhone(identifier)); // Convert phone to username
        } else {
            user.setUsername(identifier); // Already a username
        }

        System.out.println("Resolved Username: " + user.getUsername());

        boolean isAuthenticated = userService.verify(user); // Now using the updated verify method
        System.out.println("Authenticating");

        if (isAuthenticated) {
            System.out.println("User authenticated");

            // Get the user's role
            String role = userService.getUserRole(user.getUsername());
            user.setRole(role);

            // JWT token generation
            String accessToken = user.getAccessToken();
            String refreshToken = redisTemplate.opsForValue().get("refresh_token:" + user.getUsername());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("role", role);
            System.out.println("Role: " + user.getRole());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestParam("token") String refreshToken) {
        if (jwtService.validateToken(refreshToken)) {
            String username = jwtService.extractUserName(refreshToken);
            String newAccessToken = jwtService.generateAccessToken(username, "USER");
            return ResponseEntity.ok().body(Map.of("accessToken", newAccessToken));
        }
        return ResponseEntity.status(401).body("Invalid refresh token");
    }
}
