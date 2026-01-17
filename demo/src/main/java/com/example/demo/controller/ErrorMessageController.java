package com.example.demo.controller;

import com.example.demo.entity.ErrorMessage;
import com.example.demo.entity.User;
import com.example.demo.repository.ErrorMessageRepository;
import com.example.demo.repository.UserRepository;
// ^ Ili koristi UserService ako ga imas, ali repo je dovoljan za findById
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/errors")
@CrossOrigin // Obavezno za Angular
public class ErrorMessageController {

  private final ErrorMessageRepository errorRepository;
  private final UserRepository userRepository;

  public ErrorMessageController(ErrorMessageRepository errorRepository, UserRepository userRepository) {
    this.errorRepository = errorRepository;
    this.userRepository = userRepository;
  }

  @GetMapping
  public ResponseEntity<?> getErrors() {
    // 1. Izvlacimo email (ili username) iz Tokena
    String email = SecurityContextHolder.getContext().getAuthentication().getName();

    // 2. Trazimo korisnika u bazi
    User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

    // 3. Proveravamo da li ima permisiju "read_errors"
    // (Ova permisija mora biti dodata Adminu u BootstrapData)
    if (!user.getPermissions().contains("read_errors")) {
      return ResponseEntity.status(403).body("Nemate permisiju 'read_errors'.");
    }

    // 4. Vracamo sve greske
    // (Ovde mozes filtrirati greske samo za tog korisnika ako zelis: errorRepository.findByUserId(user.getId()))
    return ResponseEntity.ok(errorRepository.findAll());
  }
}
