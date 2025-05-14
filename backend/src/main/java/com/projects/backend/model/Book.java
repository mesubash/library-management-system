package com.projects.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;    
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "books")
@Data
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private int yearPublished;
    private String genre;
    private int numberOfPages;
    private String language;
    private String description;
    // private String coverImageUrl;
    private boolean isAvailable;
    // private int numberOfCopies;
    // private String location; // e.g., shelf number or library branch
    // private String addedBy; // User who added the book
    // private String addedDate; // Date when the book was added to the system
    // private String lastUpdatedBy; // User who last updated the book details
    // private String lastUpdatedDate; // Date when the book details were last updated
    // private String status; // e.g., available, checked out, reserved, lost

    
  


    
}
