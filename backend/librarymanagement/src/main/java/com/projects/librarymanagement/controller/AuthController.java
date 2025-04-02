package com.projects.librarymanagement.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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


    private UserService userService;
    private JWTService jwtService; 

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public AuthController(UserService userService, JWTService jwtService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Validate user input
        if (user.getUsername() == null || user.getPassword() == null || user.getEmail() == null) {
            return ResponseEntity.badRequest().body("Username or email or phone and password cannot be null");
        }
    
        // Encrypt password
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
    
        User registeredUser = userService.register(user);
        if (registeredUser == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
    
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful");
        response.put("user", registeredUser); 
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        boolean isAuthenticated = userService.verify(user);
        System.out.println("Authenticating");

        if (isAuthenticated) {

            System.out.println("User authenticated");
            String role = userService.getUserRole(user.getUsername()); 
            user.setRole(role);

        ;
            String jwtToken = jwtService.generateToken(user.getUsername(),role);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", jwtToken);
            response.put("role", role); 
            System.out.println("Role: " + user.getRole());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }

    }
}
