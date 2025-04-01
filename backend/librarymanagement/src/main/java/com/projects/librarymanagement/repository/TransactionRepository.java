package com.projects.librarymanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projects.librarymanagement.model.Transation;


@Repository
public interface TransactionRepository extends JpaRepository<Transation, Long>{
    
}
