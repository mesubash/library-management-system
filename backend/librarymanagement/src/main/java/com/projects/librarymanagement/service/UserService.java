package com.projects.librarymanagement.service;

import java.util.concurrent.TimeUnit;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.projects.librarymanagement.model.User;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.projects.librarymanagement.repository.UserRepository;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.AuthenticationException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final StringRedisTemplate redisTemplate;

    // Constructor Injection for dependencies
    public UserService(UserRepository userRepository, JWTService jwtService, 
                        AuthenticationManager authenticationManager, StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.redisTemplate = redisTemplate;
    }

    // Password Encoder with BCrypt for hashing passwords
    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    // Method to register a new user
    public User register(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER"); // Set default role to USER
        return userRepository.save(user);
    }

    // Method to authenticate the user and generate tokens
    public boolean verify(User user) {
        try {
            System.out.println("here in verify method");
    
            // Authenticate the user using the username and raw password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()) // Pass raw password
            );
    
            // Check if authentication is successful
            if (authentication.isAuthenticated()) {
                // Fetch the user from the database
                User existingUser = userRepository.findByUsername(user.getUsername());
                if (existingUser == null) {
                    return false; // User not found
                }
    
                // Generate role for the user
                String role = existingUser.getRole();
    
                // Generate access token and refresh token
                String accessToken = jwtService.generateAccessToken(existingUser.getUsername(), role);
                String refreshToken = jwtService.generateRefreshToken(existingUser.getUsername(), role);
    
                // Store refresh token in Redis for handling refresh logic
                redisTemplate.opsForValue().set("refresh_token:" + existingUser.getUsername(), refreshToken, 30, TimeUnit.DAYS);
    
                // Set tokens on the user object
                user.setAccessToken(accessToken);
                user.setRefreshToken(refreshToken);
    
                return true; // Authentication successful
            } else {
                return false; // Authentication failed
            }
        } catch (AuthenticationException e) {
            // Handle authentication failure
            System.out.println("Authentication failed: " + e.getMessage());
            return false;
        }
    }

    // Method to get the user's role
    public String getUserRole(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? user.getRole() : null;
    }
}
