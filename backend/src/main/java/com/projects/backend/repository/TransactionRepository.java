package com.projects.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projects.backend.model.Transation;


@Repository
public interface TransactionRepository extends JpaRepository<Transation, Long>{
    
}
