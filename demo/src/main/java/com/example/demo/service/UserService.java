package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  // 1. findAll - Vraća listu svih korisnika
  public List<User> findAll() {
    return userRepository.findAll();
  }

  // 2. save - Kreira novog korisnika (BITNO: Enkriptuje lozinku!)
  public User save(User user) {
    // Uvek enkriptuj lozinku pre cuvanja u bazu!
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  // 3. update - Ažurira korisnika
  public User update(User user) {
    // Ovde bi idealno trebalo proveriti da li se menja lozinka,
    // ali za potrebe ovog projekta samo cuvamo promene.
    // PAZNJA: Ako frontend posalje praznu lozinku, ovo moze napraviti problem.
    // Za sada pretpostavljamo da frontend salje celog usera.
    return userRepository.save(user);
  }

  // 4. findById - Traži po ID-u
  public Optional<User> findById(Long id) {
    return userRepository.findById(id);
  }

  // 5. delete - Briše po ID-u
  public void delete(Long id) {
    userRepository.deleteById(id);
  }
}
