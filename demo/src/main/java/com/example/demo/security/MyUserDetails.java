package com.example.demo.security;

import com.example.demo.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class MyUserDetails implements UserDetails {

  private User user;

  public MyUserDetails(User user) {
    this.user = user;
  }

  // Pretvaramo listu stringova (npr. "can_read") u Spring Authorities
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getPermissions().stream()
      .map(SimpleGrantedAuthority::new)
      .collect(Collectors.toList());
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public String getUsername() {
    return user.getEmail(); // Koristimo email kao username
  }

  // Standardne metode, samo stavi true
  @Override
  public boolean isAccountNonExpired() { return true; }
  @Override
  public boolean isAccountNonLocked() { return true; }
  @Override
  public boolean isCredentialsNonExpired() { return true; }
  @Override
  public boolean isEnabled() { return true; }

  // Helper metoda za tvoj kontroler ako zelis rucnu proveru
  public User getUser() {
    return user;
  }
}
