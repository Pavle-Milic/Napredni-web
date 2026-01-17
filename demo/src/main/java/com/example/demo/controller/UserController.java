package com.example.demo.controller;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.demo.security.MyUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

  @Autowired
  private UserService userService;

  // 1. GET - Listanje korisnika
  @GetMapping
  public ResponseEntity<List<User>> getAllUsers() {
    User currentUser = getCurrentUser();
    // STARI KOD: .contains("can_read_users")
    // NOVI KOD: .contains("read_user")
    if (!currentUser.getPermissions().contains("read_user")) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(userService.findAll());
  }

  // 2. POST - Kreiranje korisnika
  @PostMapping
  public ResponseEntity<?> createUser(@RequestBody User user) {
    User currentUser = getCurrentUser();

    // --- DETEKTIVSKI DEO ---
    System.out.println("========== DEBUG CREATE USER START ==========");
    System.out.println("1. Ko pokusava da kreira? -> " + currentUser.getEmail());

    List<String> perms = currentUser.getPermissions();
    System.out.println("2. Sta ta osoba ima od permisija (RAW)? -> " + perms);

    if (perms != null && !perms.isEmpty()) {
      System.out.println("3. Tip prvog elementa u listi: " + perms.get(0).getClass().getName());

      boolean imaDozvolu = perms.contains("add_user");
      System.out.println("4. Da li lista sadrzi string 'add_user'? -> " + imaDozvolu);

      // Provera da li ima razmaka ili skrivenih karaktera
      for(String p : perms) {
        if(p.trim().equals("add_user")) {
          System.out.println("   -> Pronasao sam 'add_user' ali mozda contains pada zbog whitespace-a?");
        }
      }
    } else {
      System.out.println("3. Lista permisija je NULL ili PRAZNA!");
    }
    System.out.println("=============================================");
    // -----------------------

    if (!currentUser.getPermissions().contains("add_user")) {
      return ResponseEntity.status(403).body("Nemate dozvolu. Server vidi ovo: " + currentUser.getPermissions());
    }

    user.setId(null); //fix za los create jer front salje neku glupost

    // Ostatak logike...
    if(user.getPassword() == null || user.getPassword().isEmpty()) {
      return ResponseEntity.badRequest().body("Lozinka je obavezna.");
    }

    try {
      return ResponseEntity.ok(userService.save(user));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Greska: " + e.getMessage());
    }
  }

  // 3. PUT - Izmena korisnika
  @PutMapping
  public ResponseEntity<?> updateUser(@RequestBody User user) {
    User currentUser = getCurrentUser();
    // U tokenu pise "edit_user"
    if (!currentUser.getPermissions().contains("edit_user")) {
      return ResponseEntity.status(403).body("Nemate dozvolu za izmenu.");
    }
    return ResponseEntity.ok(userService.update(user));
  }

  // 4. DELETE - Brisanje korisnika
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    // U tokenu pise "delete_user"
    if (!currentUser.getPermissions().contains("delete_user")) {
      return ResponseEntity.status(403).body("Nemate dozvolu za brisanje.");
    }
    userService.delete(id);
    return ResponseEntity.ok().build();
  }

  // 5. GET - Jedan korisnik (za edit formu)
  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    // Koristimo istu permisiju kao za listanje
    if (!currentUser.getPermissions().contains("read_user")) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(userService.findById(id).orElseThrow());
  }

  private User getCurrentUser() {
    MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return userDetails.getUser();
  }
}
