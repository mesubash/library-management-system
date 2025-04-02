package com.projects.librarymanagement.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.projects.librarymanagement.model.Book;
import com.projects.librarymanagement.service.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping("/add")
    public void addBook(Book book) {
        bookService.addBook(book);
    }
    @PostMapping("/update")
    public void updateBook(Book book) {
        bookService.updateBook(book);
    }
    @DeleteMapping("/delete")
    public void deleteBook(Long id) {
        bookService.deleteBook(id);
    }


    
}
