package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false)
  private String password;

  // Permisije čuvamo kao listu stringova (npr. "can_read", "can_start")
  // ElementCollection kreira pomoćnu tabelu u bazi automatski
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_permissions", joinColumns = @JoinColumn(name = "user_id"))
  private List<String> permissions;
}
