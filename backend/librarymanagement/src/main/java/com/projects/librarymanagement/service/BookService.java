package com.projects.librarymanagement.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projects.librarymanagement.model.Book;
import com.projects.librarymanagement.repository.BookRepository;

@Service
public class BookService {
    
    private final BookRepository bookRepository;
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    public void addBook(Book book) {
        bookRepository.save(book);
    }   
    public void updateBook(Book book) {
        bookRepository.save(book);
    }
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    // public List<Book> searchBooks(String title, String author, String genre) {
    //     return bookRepository.findByTitleContainingOrAuthorContainingOrGenreContaining(title, author, genre);
    // }
    // public List<Book> getAvailableBooks() {
    //     return bookRepository.findByIsAvailable(true);
    // }
    // public List<Book> getCheckedOutBooks() {
    //     return bookRepository.findByIsAvailable(false);
    // }
    // public List<Book> getBooksByPublisher(String publisher) {
    //     return bookRepository.findByPublisher(publisher);
    // }
    // public List<Book> getBooksByYearPublished(int year) {
    //     return bookRepository.findByYearPublished(year);
    // }
    // public List<Book> getBooksByLanguage(String language) {
    //     return bookRepository.findByLanguage(language);
    // }
    
 
}
