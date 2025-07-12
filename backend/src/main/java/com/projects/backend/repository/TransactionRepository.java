package com.projects.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projects.backend.model.Transaction;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByBookIdAndUserIdAndStatus(Long bookId, Long userId, String status);
    List<Transaction> findByUserId(Long userId);
    List<Transaction> findByBookId(Long bookId);
    List<Transaction> findByDueDateBeforeAndStatus(LocalDateTime date, String status);
}
