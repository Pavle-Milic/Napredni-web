package com.example.demo.service;

import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
import com.example.demo.repository.ErrorMessageRepository;
import com.example.demo.repository.MachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncMachineService {

  @Autowired
  private MachineRepository machineRepository;
  @Autowired
  private SimpMessagingTemplate messagingTemplate; // Za WebSockete
  @Autowired
  private ErrorMessageRepository errorMessageRepository;

  @Async
  public void startMachineAsync(Long machineId) {
    try {
      System.out.println("Async Start started for machine: " + machineId);
      Thread.sleep(10000); // 10 sekundi

      Machine machine = machineRepository.findById(machineId).orElseThrow();
      // Provera da li je u medjuvremenu obrisana ili nesto drugo

      machine.setStatus(MachineStatus.RUNNING);
      machine.setBusy(false);
      machineRepository.save(machine);

      // Slanje poruke frontendu
      // messagingTemplate.convertAndSend("/topic/machines", machineRepository.findAll());
      // Ili samo tu jednu masinu, zavisno sta frontend ocekuje

    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Async
  public void stopMachineAsync(Long machineId) {
    try {
      System.out.println("Async Stop started for machine: " + machineId);
      Thread.sleep(10000);

      Machine machine = machineRepository.findById(machineId).orElseThrow();
      machine.setStatus(MachineStatus.STOPPED);
      machine.setBusy(false);
      machineRepository.save(machine);

      // messagingTemplate.convertAndSend("/topic/machines", machine);

    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Async
  public void restartMachineAsync(Long machineId) {
    try {
      System.out.println("Async Restart started for machine: " + machineId);

      // FAZA 1: GASENJE (5 sekundi)
      Thread.sleep(5000);

      // Izvlacimo masinu iz baze (mora unutar try bloka)
      Machine machine = machineRepository.findById(machineId)
        .orElseThrow(() -> new RuntimeException("Masina nije pronadjena (ID: " + machineId + ")"));

      machine.setStatus(MachineStatus.STOPPED);
      machineRepository.save(machine); // <--- Ovde moze da pukne
      System.out.println("Masina STOPPED (Restart faza 1/2)");

      // FAZA 2: PALJENJE (5 sekundi)
      Thread.sleep(5000);

      // Opet izvlacimo svezu instancu (dobra praksa kod dugih procesa)
      machine = machineRepository.findById(machineId)
        .orElseThrow(() -> new RuntimeException("Masina nije pronadjena u fazi 2"));

      machine.setStatus(MachineStatus.RUNNING);
      machine.setBusy(false); // <--- KLJUCNO: OSLOBADJANJE
      machineRepository.save(machine);

      System.out.println("Masina RESTARTED uspesno.");

    } catch (Exception e) {
      // OVO JE NOVO: Hvatamo BILO KOJU gresku (baza, null pointer, interrup...)
      System.err.println("GRESKA u restartu: " + e.getMessage());
      e.printStackTrace();

      // --- RECOVERY MEHANIZAM ---
      // Ako je doslo do greske, MORAMO osloboditi masinu da ne ostane zaglavljena
      try {
        Machine m = machineRepository.findById(machineId).orElse(null);
        if (m != null) {
          m.setBusy(false); // Oslobadjam je
          // Opciono: Vrati status na STOPPED ako je restart pukao
          // m.setStatus(MachineStatus.STOPPED);
          machineRepository.save(m);
          System.out.println("RECOVERY: Masina je nasilno oslobodjena (busy=false).");
        }
      } catch (Exception ex) {
        System.err.println("Fatalna greska: Ne mogu ni da oslobodim masinu.");
      }
    }
  }
}
