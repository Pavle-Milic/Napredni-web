package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.ArrayList;
import java.util.List;

@Component
public class BootstrapData implements CommandLineRunner{
  public final UserRepository userRepository;
  public final PasswordEncoder passwordEncoder;
  @Autowired
  public BootstrapData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) throws Exception {
    if(userRepository.findByEmail("admin@raf.rs").isEmpty()) {
      User admin = new User();
      admin.setFirstName("Admin");
      admin.setLastName("Adminovic");
      admin.setEmail("admin@raf.rs");
      admin.setPassword(passwordEncoder.encode("admin"));

      List<String> adminPermissions = new ArrayList<>();

      adminPermissions.add("read_user");
      adminPermissions.add("add_user");
      adminPermissions.add("edit_user");
      adminPermissions.add("delete_user");

      // Permisije za masine
      adminPermissions.add("search_machine");
      adminPermissions.add("start_machine");
      adminPermissions.add("stop_machine");
      adminPermissions.add("restart_machine");
      adminPermissions.add("create_machine");
      adminPermissions.add("destroy_machine");
      adminPermissions.add("read_errors"); // Dodato i ovo

      admin.setPermissions(adminPermissions);

      userRepository.save(admin);
      System.out.println("Admin created!");
    }
    //Pera
    if(userRepository.findByEmail("pera@raf.rs").isEmpty()) {
      User user = new User();
      user.setFirstName("Pera");
      user.setLastName("Peric");
      user.setEmail("pera@raf.rs");
      user.setPassword(passwordEncoder.encode("pera"));

      List<String> userPermissions = new ArrayList<>();
      // Obican korisnik
      userPermissions.add("read_user");
      userPermissions.add("search_machine");
      userPermissions.add("create_machine");
      userPermissions.add("read_errors");
      // Nema start/stop/delete...

      user.setPermissions(userPermissions);

      userRepository.save(user);
      System.out.println("User Pera created!");
    }

    System.out.println("Data loaded!");
  }
}
