package com.projects.librarymanagement.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestBody;
import com.projects.librarymanagement.service.UserService;
import com.projects.librarymanagement.model.User;
import com.projects.librarymanagement.service.JWTService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import java.util.HashMap;
import java.util.Map;


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
        boolean isAuthenticated = userService.verify(user); // Now using the updated verify method
        System.out.println("Authenticating");
    
        if (isAuthenticated) {
            System.out.println("User authenticated");
    
            // Get the user's role (assuming it's stored somewhere or fetched from DB)
            String role = userService.getUserRole(user.getUsername());
            user.setRole(role);
    
            // The JWT token generation logic is already handled in the 'verify' method
            String accessToken = user.getAccessToken(); // Get the generated access token
            String refreshToken = redisTemplate.opsForValue().get("refresh_token:" + user.getUsername()); // Get the generated refresh token from Redis
    
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("accessToken", accessToken);  // Provide access token to the user
            response.put("refreshToken", refreshToken);  // Provide refresh token as well
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
