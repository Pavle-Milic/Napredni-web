package com.example.demo.repository;

import com.example.demo.entity.ScheduledOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledOperationRepository extends JpaRepository<ScheduledOperation,Long> {
  List<ScheduledOperation> findAllByScheduledTimeBefore(LocalDateTime now);
}
