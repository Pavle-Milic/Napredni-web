package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Machine {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Enumerated(EnumType.STRING)
  private MachineStatus status; // STOPPED, RUNNING

  private boolean active; // Za soft delete (meko brisanje)

  private boolean busy; // Da li se trenutno izvršava operacija?

  @ManyToOne
  private User createdBy;

  private LocalDateTime createdAt;

  // Optimistic locking za sprečavanje race condition-a
  @Version
  private Integer version;
}
