package com.projects.backend.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.projects.backend.model.Book;
import com.projects.backend.model.Transaction;
import com.projects.backend.repository.TransactionRepository;


@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BookService bookService;

    public TransactionService(TransactionRepository transactionRepository, BookService bookService) {
        this.transactionRepository = transactionRepository;
        this.bookService = bookService;
    }

    private static final int LOAN_PERIOD_DAYS = 14;
    private static final double FINE_PER_DAY = 0.50;

    @Transactional
    public Transaction borrowBook(Long bookId, Long userId) {
        Book book = bookService.borrowBook(bookId);

        Transaction transaction = Transaction.builder()
                .bookId(bookId)
                .userId(userId)
                .borrowDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(LOAN_PERIOD_DAYS))
                .status("borrowed")
                .isLate(false)
                .fine(0.0)
                .build();

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction returnBook(Long bookId, Long userId) {
        Book book = bookService.returnBook(bookId);

        Transaction transaction = transactionRepository.findByBookIdAndUserIdAndStatus(bookId, userId, "borrowed")
                .orElseThrow(() -> new RuntimeException("No active borrowing found for this book"));

        LocalDateTime now = LocalDateTime.now();
        transaction.setReturnDate(now);
        transaction.setStatus("returned");

        if (now.isAfter(transaction.getDueDate())) {
            transaction.setIsLate(true);
            long daysLate = ChronoUnit.DAYS.between(transaction.getDueDate(), now);
            transaction.setFine(daysLate * FINE_PER_DAY);
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> getBookTransactions(Long bookId) {
        return transactionRepository.findByBookId(bookId);
    }

    public List<Transaction> getOverdueTransactions() {
        return transactionRepository.findByDueDateBeforeAndStatus(LocalDateTime.now(), "borrowed");
    }
}
