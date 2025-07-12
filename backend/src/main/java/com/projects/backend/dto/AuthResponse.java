package com.projects.backend.dto;

public record AuthResponse(
    String token,
    String refreshToken,
    String email,
    String name,
    String role
) {}
