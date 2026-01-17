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
        // Loguj grešku
        createErrorLog(op, "Machine not found or destroyed");
        scheduledRepo.delete(op);
        continue;
      }

      if (machine.isBusy()) {
        // Opcija 1: Probaj kasnije
        // Opcija 2: Loguj grešku (kao u specifikaciji)
        createErrorLog(op, "Machine is busy");
        scheduledRepo.delete(op);
        continue;
      }

      // Pokušaj izvršenja
      try {
        if ("START".equals(op.getOperation())) {
          if (machine.getStatus() == MachineStatus.STOPPED) {
            machine.setBusy(true);
            machineRepository.save(machine);
            asyncService.startMachineAsync(machine.getId());
          } else {
            createErrorLog(op, "Machine already running");
          }
        }
        // ... handle STOP and RESTART
      } catch (Exception e) {
        createErrorLog(op, e.getMessage());
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
    errorRepo.save(err);
  }
}
