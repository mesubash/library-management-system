package com.projects.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projects.backend.model.Book;
import com.projects.backend.repository.BookRepository;


@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    @Transactional
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book book) {
        Book existingBook = getBookById(id);
        
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setPublishedYear(book.getPublishedYear());
        existingBook.setTotalCopies(book.getTotalCopies());
        existingBook.setAvailableCopies(book.getAvailableCopies());
        existingBook.setCategoryId(book.getCategoryId());

        return bookRepository.save(existingBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    public List<Book> searchBooks(String title, String author, String isbn) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(
                title != null ? title : "",
                author != null ? author : "",
                isbn != null ? isbn : ""
        );
    }

    public List<Book> getAvailableBooks() {
        return bookRepository.findByAvailableCopiesGreaterThan(0);
    }

    @Transactional
    public Book borrowBook(Long bookId) {
        Book book = getBookById(bookId);
        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available for borrowing");
        }
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        return bookRepository.save(book);
    }

    @Transactional
    public Book returnBook(Long bookId) {
        Book book = getBookById(bookId);
        if (book.getAvailableCopies() >= book.getTotalCopies()) {
            throw new RuntimeException("All copies are already returned");
        }
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        return bookRepository.save(book);
    }
}
