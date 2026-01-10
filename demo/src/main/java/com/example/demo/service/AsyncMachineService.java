package com.example.demo.service;

import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
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

  @Async // Ovo se izvršava u drugom thread-u
  public void startMachineAsync(Long machineId) {
    try {
      Thread.sleep(10000 + (long)(Math.random() * 2000)); // Simulacija 10-12s

      Machine machine = machineRepository.findById(Math.toIntExact(machineId)).orElseThrow();
      machine.setStatus(MachineStatus.RUNNING);
      machine.setBusy(false); // Oslobađamo mašinu
      machineRepository.save(machine);

      // Obavesti frontend preko WebSocketa
      messagingTemplate.convertAndSend("/topic/machines", machine);

    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Async
  public void stopMachineAsync(Long machineId) {
    // Slična logika, setStatus(STOPPED)
    // ... sleep ...
    // messagingTemplate.convertAndSend(...)
  }

  @Async
  public void restartMachineAsync(Long machineId) {
    try {
      long duration = 10000 + (long)(Math.random() * 2000);

      // Prva polovina vremena
      Thread.sleep(duration / 2);
      Machine machine = machineRepository.findById(Math.toIntExact(machineId)).orElseThrow();
      machine.setStatus(MachineStatus.STOPPED); // Privremeno ugašena
      machineRepository.save(machine);
      // Možemo poslati update i ovde ako želimo real-time prikaz

      // Druga polovina vremena
      Thread.sleep(duration / 2);
      machine.setStatus(MachineStatus.RUNNING);
      machine.setBusy(false);
      machineRepository.save(machine);

      messagingTemplate.convertAndSend("/topic/machines", machine);

    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }
}
