package com.projects.backend.dto;

public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private String name;
    private String role;

    public TokenResponse() {}

    public TokenResponse(String accessToken, String refreshToken, String email, String name, String role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static TokenResponseBuilder builder() {
        return new TokenResponseBuilder();
    }

    public static class TokenResponseBuilder {
        private String accessToken;
        private String refreshToken;
        private String email;
        private String name;
        private String role;

        TokenResponseBuilder() {}

        public TokenResponseBuilder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public TokenResponseBuilder refreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
            return this;
        }

        public TokenResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public TokenResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public TokenResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public TokenResponse build() {
            return new TokenResponse(accessToken, refreshToken, email, name, role);
        }
    }
}
