package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.security.JwtUtil; // Pretpostavka da imas ovu klasu
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin // Dozvoljava pristup sa Angulara (4200)
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  @Autowired
  public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
      // 1. Pokušaj autentifikacije (proverava email i password)
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
          loginRequest.getEmail(),
          loginRequest.getPassword()
        )
      );

      // 2. Ako je uspelo, stavi korisnika u SecurityContext
      SecurityContextHolder.getContext().setAuthentication(authentication);

      // 3. Generiši token
      String jwt = jwtUtil.generateToken(authentication);

      // 4. Vrati token frontendu
      return ResponseEntity.ok(new LoginResponse(jwt));

    } catch (Exception e) {
      // Ako password nije dobar ili korisnik ne postoji
      return ResponseEntity.status(401).body("Email ili lozinka nisu ispravni.");
    }
  }
}
