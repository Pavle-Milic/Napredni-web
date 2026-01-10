package com.example.demo.controller;

import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.MachineRepository;
import com.example.demo.security.MyUserDetails;
import com.example.demo.service.AsyncMachineService;
import com.example.demo.service.MachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

  @Autowired
  private MachineRepository machineRepository;

  @Autowired
  private MachineService machineService;

  @Autowired
  private AsyncMachineService asyncService;

  // 1. GET - Izlistaj sve aktivne masine za ulogovanog korisnika
  @GetMapping
  public ResponseEntity<List<Machine>> getAllMachines() {
    User currentUser = getCurrentUser();
    if (!currentUser.getPermissions().contains("can_read_machines")) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(machineService.findAllActiveForUser(currentUser));
  }

  // 2. POST - Start Machine
  @PostMapping("/start/{id}")
  public ResponseEntity<?> startMachine(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    if (!currentUser.getPermissions().contains("can_start_machines"))
      return ResponseEntity.status(403).body("Nemate dozvolu za pokretanje.");

    Machine machine = machineRepository.findById(id).orElseThrow();

    if (machine.isBusy() || machine.getStatus() != MachineStatus.STOPPED)
      return ResponseEntity.badRequest().body("Mašina je zauzeta ili je već pokrenuta.");

    machine.setBusy(true);
    machineRepository.save(machine);

    asyncService.startMachineAsync(id);
    return ResponseEntity.ok().build();
  }

  // 3. POST - Stop Machine
  @PostMapping("/stop/{id}")
  public ResponseEntity<?> stopMachine(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    if (!currentUser.getPermissions().contains("can_stop_machines"))
      return ResponseEntity.status(403).body("Nemate dozvolu za zaustavljanje.");

    Machine machine = machineRepository.findById(id).orElseThrow();

    if (machine.isBusy() || machine.getStatus() != MachineStatus.RUNNING)
      return ResponseEntity.badRequest().body("Mašina je zauzeta ili je već ugašena.");

    machine.setBusy(true);
    machineRepository.save(machine);

    asyncService.stopMachineAsync(id);
    return ResponseEntity.ok().build();
  }

  // 4. POST - Restart Machine
  @PostMapping("/restart/{id}")
  public ResponseEntity<?> restartMachine(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    if (!currentUser.getPermissions().contains("can_restart_machines"))
      return ResponseEntity.status(403).body("Nemate dozvolu za restart.");

    Machine machine = machineRepository.findById(id).orElseThrow();

    if (machine.isBusy() || machine.getStatus() != MachineStatus.RUNNING)
      return ResponseEntity.badRequest().body("Samo upaljena mašina se može restartovati.");

    machine.setBusy(true);
    machineRepository.save(machine);

    asyncService.restartMachineAsync(id); // Ovu metodu dodaj u AsyncMachineService (stop pa start)
    return ResponseEntity.ok().build();
  }

  // 5. DELETE - Destroy Machine (Soft delete)
  @DeleteMapping("/{id}")
  public ResponseEntity<?> destroyMachine(@PathVariable Long id) {
    User currentUser = getCurrentUser();
    if (!currentUser.getPermissions().contains("can_destroy_machines"))
      return ResponseEntity.status(403).body("Nemate dozvolu za brisanje.");

    try {
      machineService.destroyMachine(id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // Helper metoda da ne ponavljamo kod za dobijanje korisnika
  private User getCurrentUser() {
    MyUserDetails userDetails = (MyUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return userDetails.getUser();
  }
}
