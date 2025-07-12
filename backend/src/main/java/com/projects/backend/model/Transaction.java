package com.projects.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long bookId;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private String status;
    private boolean isLate;
    private double fine;

    public Transaction() {}

    public Transaction(Long id, Long userId, Long bookId, LocalDateTime borrowDate, LocalDateTime dueDate,
                      LocalDateTime returnDate, String status, boolean isLate, double fine) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.isLate = isLate;
        this.fine = fine;
    }

    public static TransactionBuilder builder() {
        return new TransactionBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public LocalDateTime getBorrowDate() {
        return borrowDate;
    }

    public void setBorrowDate(LocalDateTime borrowDate) {
        this.borrowDate = borrowDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isLate() {
        return isLate;
    }

    public void setIsLate(boolean isLate) {
        this.isLate = isLate;
    }

    public double getFine() {
        return fine;
    }

    public void setFine(double fine) {
        this.fine = fine;
    }

    public static class TransactionBuilder {
        private Long id;
        private Long userId;
        private Long bookId;
        private LocalDateTime borrowDate;
        private LocalDateTime dueDate;
        private LocalDateTime returnDate;
        private String status;
        private boolean isLate;
        private double fine;

        TransactionBuilder() {}

        public TransactionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TransactionBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public TransactionBuilder bookId(Long bookId) {
            this.bookId = bookId;
            return this;
        }

        public TransactionBuilder borrowDate(LocalDateTime borrowDate) {
            this.borrowDate = borrowDate;
            return this;
        }

        public TransactionBuilder dueDate(LocalDateTime dueDate) {
            this.dueDate = dueDate;
            return this;
        }

        public TransactionBuilder returnDate(LocalDateTime returnDate) {
            this.returnDate = returnDate;
            return this;
        }

        public TransactionBuilder status(String status) {
            this.status = status;
            return this;
        }

        public TransactionBuilder isLate(boolean isLate) {
            this.isLate = isLate;
            return this;
        }

        public TransactionBuilder fine(double fine) {
            this.fine = fine;
            return this;
        }

        public Transaction build() {
            return new Transaction(id, userId, bookId, borrowDate, dueDate, returnDate, status, isLate, fine);
        }
    }
}
