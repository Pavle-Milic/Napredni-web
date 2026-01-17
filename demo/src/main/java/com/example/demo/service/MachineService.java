package com.example.demo.service;

import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
import com.example.demo.entity.User;
import com.example.demo.repository.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MachineService {

  @Autowired
  private MachineRepository machineRepository;

  // Tvoja metoda - vraca samo aktivne masine tog korisnika
  public List<Machine> findAllActiveForUser(User user){
    return machineRepository.findByActiveTrueAndCreatedBy_Id(user.getId());
  }

  // Izmenjena create metoda da prihvata objekat sa frontenda
  public Machine createMachine(Machine machine, User user){
    machine.setId(null); // Osiguravamo da je nova
    machine.setActive(true);
    machine.setBusy(false);
    machine.setCreatedBy(user);

    // Ako status nije poslat, stavi STOPPED
    if(machine.getStatus() == null) {
      machine.setStatus(MachineStatus.STOPPED);
    }

    // Datum se setuje automatski u @PrePersist u Entitetu, ili ovde:
    // machine.setCreatedAt(LocalDateTime.now());

    return machineRepository.save(machine);
  }

  // Tvoja odlicna metoda za Soft Delete
  public void destroyMachine(Long id){
    Machine machine = machineRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Masina ne postoji"));

    if(machine.getStatus() == MachineStatus.STOPPED){
      machine.setActive(false); // Soft delete
      machineRepository.save(machine);
    } else {
      throw new RuntimeException("Machine must be STOPPED to be destroyed");
    }
  }

  // Dodata metoda za pretragu (koristimo tvoj filter po useru kao osnovu)
  // Kasnije ovde mozes dodati filtriranje po imenu i datumima
  public List<Machine> search(User user, String name, String status) {
    // Za sada vracamo sve userove masine, filtriranje cemo raditi ili ovde ili u bazi
    return findAllActiveForUser(user);
  }
}
