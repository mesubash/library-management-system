package com.projects.librarymanagement.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.projects.librarymanagement.model.User;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.projects.librarymanagement.repository.UserRepository;
import com.projects.librarymanagement.service.JWTService;

@Service
public class UserService {


    private UserRepository userRepository;
    private JWTService jwtService;
    AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, JWTService jwtService, AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    

    public User register(User user){
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER"); // Set default role to USER
        return userRepository.save(user);
    }

    public boolean verify(User user){
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            return authentication.isAuthenticated();
        }catch(Exception e){
            return false;
        }
    }

    public String getUserRole(String username){
        User user = userRepository.findByUsername(username);
        return user!= null ? user.getRole() : null;
    }

}
