package com.example.demo.dto;

import lombok.Data;

@Data
public class LoginResponse {
  private String token; // Ovo mora da se poklapa sa interfejsom u Angularu

  public LoginResponse(String token) {
    this.token = token;
  }
}
