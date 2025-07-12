package com.projects.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projects.backend.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(
            String title, String author, String isbn);
    
    List<Book> findByAvailableCopiesGreaterThan(Integer copies);
    
    List<Book> findByCategoryId(Long categoryId);
    
    List<Book> findByGenreIgnoreCase(String genre);
}
