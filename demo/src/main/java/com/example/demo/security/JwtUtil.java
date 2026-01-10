package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

  // U praksi ovo ide u application.properties, ali za vezbu moze ovde
  // Mora biti dugacak string (HMAC-SHA zahteva 256 bita)
  private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  // Generisanje tokena
  public String generateToken(String email, Map<String, Object> claims) {
    return Jwts.builder()
      .setClaims(claims)
      .setSubject(email)
      .setIssuedAt(new Date(System.currentTimeMillis()))
      .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 sati
      .signWith(SECRET_KEY)
      .compact();
  }

  // Overload metoda za lakse pozivanje iz kontrolera
  public String generateToken(org.springframework.security.core.Authentication auth) {
    MyUserDetails userDetails = (MyUserDetails) auth.getPrincipal();
    Map<String, Object> claims = new HashMap<>();
    // Mozemo ubaciti permisije u token da front ne mora da nagadja
    claims.put("permissions", userDetails.getAuthorities());
    return generateToken(userDetails.getUsername(), claims);
  }

  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }
}
