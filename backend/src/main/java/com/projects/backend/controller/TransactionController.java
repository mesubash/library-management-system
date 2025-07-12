package com.projects.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.projects.backend.model.Transaction;
import com.projects.backend.model.User;
import com.projects.backend.service.TransactionService;


@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private TransactionService transactionService;
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
    @PostMapping("/borrow/{bookId}")
    public ResponseEntity<Transaction> borrowBook(
            @PathVariable Long bookId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.borrowBook(bookId, user.getId()));
    }

    @PostMapping("/return/{bookId}")
    public ResponseEntity<Transaction> returnBook(
            @PathVariable Long bookId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.returnBook(bookId, user.getId()));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Transaction>> getUserTransactions(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.getUserTransactions(user.getId()));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Transaction>> getBookTransactions(@PathVariable Long bookId) {
        return ResponseEntity.ok(transactionService.getBookTransactions(bookId));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Transaction>> getOverdueTransactions() {
        return ResponseEntity.ok(transactionService.getOverdueTransactions());
    }
}
