package com.example.demo.controller;

import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
import com.example.demo.entity.ScheduledOperation;
import com.example.demo.entity.User;
import com.example.demo.repository.MachineRepository;
import com.example.demo.security.MyUserDetails;
import com.example.demo.service.AsyncMachineService;
import com.example.demo.service.MachineService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/machines")
@CrossOrigin
public class MachineController {

  private final MachineService machineService;
  private final UserService userService; // Dodajemo UserService

  public MachineController(MachineService machineService, UserService userService) {
    this.machineService = machineService;
    this.userService = userService;
  }

  // 1. PRETRAGA (SEARCH)
  @GetMapping("/search")
  public ResponseEntity<?> search(
    @RequestParam(required = false) String name,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String dateFrom,
    @RequestParam(required = false) String dateTo
  ) {
    User user=getCurrentUser();
    // Provera permisije "search_machine"
    if (!checkPermission("search_machine")) {
      return ResponseEntity.status(403).body("Nemate permisiju 'search_machine'.");
    }
    // Ovde pozivas servis za pretragu (implementiraj search u servisu ako vec nisi)
    // Za sada vracamo sve ako nemas filter logic
    return ResponseEntity.ok(machineService.findAllActiveForUser(user));
  }

  // 2. KREIRANJE (CREATE)
  @PostMapping("/create")
  public ResponseEntity<?> createMachine(@RequestBody Machine machine) {
    // Provera permisije "create_machine"
    if (!checkPermission("create_machine")) {
      return ResponseEntity.status(403).build();
    }

    // --- KLJUCNO: VEZUJEMO MASINU ZA ULOGOVANOG KORISNIKA ---
    User user = getCurrentUser();
    machine.setCreatedBy(user); // <--- OVO JE FALILO
    // --------------------------------------------------------

    try {
      return ResponseEntity.ok(machineService.createMachine(machine, user));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Greska: " + e.getMessage());
    }
  }

  // 3. BRISANJE (DESTROY)
  @DeleteMapping("/{id}")
  public ResponseEntity<?> destroyMachine(@PathVariable Long id) {
    if (!checkPermission("destroy_machine")) {
      return ResponseEntity.status(403).build();
    }
    try {
      // Zovemo TVOJU destroy metodu koja proverava status
      machineService.destroyMachine(id);
      return ResponseEntity.ok().build();
    } catch (RuntimeException e) {
      // Hvatamo gresku ako masina nije STOPPED
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // START - Odmah
  @PostMapping("/start/{id}")
  public ResponseEntity<?> start(@PathVariable Long id) {
    // ... provera permisije ...
    try {
      machineService.startMachine(id); // Ovo sad samo setuje busy i pokrece async
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // SCHEDULE - Zakazivanje
  @PostMapping("/schedule")
  public ResponseEntity<?> schedule(@RequestBody ScheduledOperation request) {
    // Request body treba da ima: machineId, operation ("START"), scheduledTime
    User user = getCurrentUser();
    if(!user.getPermissions().contains("can_schedule")) { // Dodaj ovu permisiju ako zelis
      // ili koristi postojece start/stop permisije
    }

    machineService.scheduleOperation(
      request.getMachineId(),
      request.getOperation(),
      request.getScheduledTime(),
      user.getId()
    );

    return ResponseEntity.ok().build();
  }

  // --- POMOCNE METODE ---

  private User getCurrentUser() {
    MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    // Cesto je bolje povuci svezeg usera iz baze jer onaj u tokenu moze biti star
    return userService.findById(userDetails.getUser().getId()).orElseThrow();
  }

  private boolean checkPermission(String permission) {
    User user = getCurrentUser();
    return user.getPermissions().contains(permission);
  }
}
