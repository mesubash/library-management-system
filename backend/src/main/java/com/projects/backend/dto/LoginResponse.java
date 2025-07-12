package com.projects.backend.dto;

public class LoginResponse {
    private String token;
    private String email;
    private String name;
    private String role;

    public LoginResponse() {}

    public LoginResponse(String token, String email, String name, String role) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public static class LoginResponseBuilder {
        private String token;
        private String email;
        private String name;
        private String role;

        LoginResponseBuilder() {}

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, email, name, role);
        }
    }
}