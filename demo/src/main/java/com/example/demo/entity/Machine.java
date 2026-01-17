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

  @ManyToOne(optional = false) // Ovo kaze Javi: Mora postojati user
  @JoinColumn(name = "user_id", nullable = false) // Ovo kaze Bazi: Kolona ne sme biti NULL
  private User createdBy;

  private LocalDateTime createdAt;

  // Optimistic locking za sprečavanje race condition-a
  @Version
  private Integer version;

  @PrePersist
  public void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.active = true;

    if (this.status == null) {
      this.status = MachineStatus.STOPPED;
    }
  }
}
