package com.example.demo.repository;

import com.example.demo.entity.ErrorMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorMessageRepository extends JpaRepository<ErrorMessage,Long> {
  List<ErrorMessage> findByUserId(Long userId);
}
