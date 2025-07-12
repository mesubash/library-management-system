package com.projects.backend.service;

import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projects.backend.dto.LoginRequest;
import com.projects.backend.dto.LoginResponse;
import com.projects.backend.dto.RegisterRequest;
import com.projects.backend.dto.TokenResponse;
import com.projects.backend.exception.InvalidCredentialsException;
import com.projects.backend.exception.UserAlreadyExistsException;
import com.projects.backend.model.User;
import com.projects.backend.repository.UserRepository;
import com.projects.backend.security.JwtTokenProvider;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            TokenBlacklistService tokenBlacklistService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
        if (!role.equals("ADMIN") && !role.equals("USER")) {
            role = "USER";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        log.info("Registering new user with email: {} with role: {}", request.getEmail(), role);
        return userRepository.save(user);
    }

    public TokenResponse authenticateAndGetTokens(LoginRequest request) {
        try {
            log.info("Attempting login for user: {}", request.getEmail());
            
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new InvalidCredentialsException("User not found with email: " + request.getEmail()));
            
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String accessToken = jwtTokenProvider.generateAccessToken(authentication);
                String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

                return TokenResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build();
            } catch (Exception e) {
                log.error("Password verification failed for user {}: {}", request.getEmail(), e.getMessage());
                throw new InvalidCredentialsException("Invalid password");
            }
        } catch (Exception e) {
            log.error("Login failed for user {}: {}", request.getEmail(), e.getMessage());
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }

    public TokenResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidCredentialsException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getUsernameFromJWT(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                email,
                null,
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );

        String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Invalidate old refresh token
        long oldTokenTtl = jwtTokenProvider.getExpirationFromToken(refreshToken);
        if (oldTokenTtl > 0) {
            tokenBlacklistService.blacklistToken(refreshToken, oldTokenTtl);
        }

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    public void logout(String refreshToken, String accessToken) {
        // Blacklist both tokens if they're valid
        if (refreshToken != null) {
            try {
                long refreshTtl = jwtTokenProvider.getExpirationFromToken(refreshToken);
                if (refreshTtl > 0) {
                    tokenBlacklistService.blacklistToken(refreshToken, refreshTtl);
                }
            } catch (Exception e) {
                log.warn("Failed to blacklist refresh token: {}", e.getMessage());
            }
        }

        if (accessToken != null) {
            try {
                long accessTtl = jwtTokenProvider.getExpirationFromToken(accessToken);
                if (accessTtl > 0) {
                    tokenBlacklistService.blacklistToken(accessToken, accessTtl);
                }
            } catch (Exception e) {
                log.warn("Failed to blacklist access token: {}", e.getMessage());
            }
        }
    }
}
