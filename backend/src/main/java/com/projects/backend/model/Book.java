package com.projects.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;    
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "books")
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

    
  
    public Book(Long id, String title, String author, String isbn, String publisher, int yearPublished, String genre,
            int numberOfPages, String language, String description, boolean isAvailable) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
        this.yearPublished = yearPublished;
        this.genre = genre;
        this.numberOfPages = numberOfPages;
        this.language = language;
        this.description = description;
        this.isAvailable = isAvailable;
    }
    public Book() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public String getIsbn() {
        return isbn;
    }
    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }
    public String getPublisher() {
        return publisher;
    }
    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }
    public int getYearPublished() {
        return yearPublished;
    }
    public void setYearPublished(int yearPublished) {
        this.yearPublished = yearPublished;
    }
    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
    public int getNumberOfPages() {
        return numberOfPages;
    }
    public void setNumberOfPages(int numberOfPages) {
        this.numberOfPages = numberOfPages;
    }
    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public boolean isAvailable() {
        return isAvailable;
    }
    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    
    

    
}
