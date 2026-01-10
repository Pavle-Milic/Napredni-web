package com.example.demo.repository;

import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Integer> {
  List<Machine> findByActiveTrue();
  List<Machine> findByActiveTrueAndCreatedBy_Id(Long userId);
}
