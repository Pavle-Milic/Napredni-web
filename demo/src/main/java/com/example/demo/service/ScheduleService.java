package com.example.demo.service;

import com.example.demo.entity.ErrorMessage;
import com.example.demo.entity.Machine;
import com.example.demo.entity.MachineStatus;
import com.example.demo.entity.ScheduledOperation;
import com.example.demo.repository.ErrorMessageRepository;
import com.example.demo.repository.MachineRepository;
import com.example.demo.repository.ScheduledOperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduleService {

  @Autowired
  private ScheduledOperationRepository scheduledRepo;
  @Autowired
  private MachineRepository machineRepository;
  @Autowired
  private AsyncMachineService asyncService;
  @Autowired
  private ErrorMessageRepository errorRepo;

  @Scheduled(fixedDelay = 5000) // Proverava svakih 5 sekundi
  public void processScheduledOperations() {
    LocalDateTime now = LocalDateTime.now();
    List<ScheduledOperation> ops = scheduledRepo.findAllByScheduledTimeBefore(now);

    for (ScheduledOperation op : ops) {
      Machine machine = machineRepository.findById((op.getMachineId())).orElse(null);

      if (machine == null || !machine.isActive()) {
        createErrorLog(op, "Masina ne postoji ili je unistena"); // Prosledjujemo ceo 'op'
        scheduledRepo.delete(op);
        continue;
      }

      if (machine.isBusy()) {
        // Loguj grešku (kao u specifikaciji)
        createErrorLog(op, "Machine is busy");
        scheduledRepo.delete(op);
        continue;
      }

      // Pokušaj izvršenja
      try {
        // --- LOGIKA KOJA JE FALILA ---

        // SLUCAJ 1: START
        if ("START".equalsIgnoreCase(op.getOperation())) {
          if (machine.getStatus() == MachineStatus.STOPPED) {
            machine.setBusy(true);
            machineRepository.save(machine);
            asyncService.startMachineAsync(machine.getId());
          } else {
            createErrorLog(op, "Masina vec radi, ne moze se startovati.");
          }
        }
        // SLUCAJ 2: STOP (Ovo ti je falilo)
        else if ("STOP".equalsIgnoreCase(op.getOperation())) {
          if (machine.getStatus() == MachineStatus.RUNNING) {
            machine.setBusy(true);
            machineRepository.save(machine);
            asyncService.stopMachineAsync(machine.getId());
          } else {
            createErrorLog(op, "Masina je vec ugasena, ne moze se stopirati.");
          }
        }
        // SLUCAJ 3: RESTART (I ovo ti je falilo)
        else if ("RESTART".equalsIgnoreCase(op.getOperation())) {
          // Restart mozemo raditi ako masina nije busy (sto smo vec proverili gore)
          // Neki sistemi dozvoljavaju restart samo ako je RUNNING, neki uvek.
          // Ovde dozvoljavamo uvek, osim ako je busy.
          machine.setBusy(true);
          machineRepository.save(machine);
          asyncService.restartMachineAsync(machine.getId());
        }
        // SLUCAJ: NEPOZNATA OPERACIJA
        else {
          createErrorLog(op, "Nepoznata operacija: " + op.getOperation());
        }

      } catch (Exception e) {
        createErrorLog(op, "Sistemska greska: " + e.getMessage());
        e.printStackTrace();
      }
      // Obriši izvršenu operaciju
      scheduledRepo.delete(op);
    }
  }

  private void createErrorLog(ScheduledOperation op, String msg) {
    ErrorMessage err = new ErrorMessage();
    err.setDate(LocalDateTime.now());
    err.setMachineId(op.getMachineId());
    err.setOperation(op.getOperation());
    err.setMessage(msg);
    err.setUserId(op.getUserId());
    errorRepo.save(err);
  }
}
