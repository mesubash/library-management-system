package com.projects.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;    
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String identifier;
    private String password;
    private String email;
    private String name;
    private String phoneNumber;
    private String address;
    private String role; // e.g., admin, librarian, member




}