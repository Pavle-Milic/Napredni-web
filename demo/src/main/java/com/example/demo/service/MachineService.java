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
  public List<Machine> findAllActiveForUser(User user){
    return machineRepository.findByActiveTrueAndCreatedBy_Id(user.getId());
  }

  public Machine createMachine(String name, User user){
    Machine machine = new Machine();
    machine.setName(name);
    machine.setCreatedBy(user);
    machine.setStatus(MachineStatus.STOPPED);
    machine.setActive(true);
    machine.setBusy(false);
    return machineRepository.save(machine);
  }
  public void destroyMachine(Long id){
    Machine machine=machineRepository.findById(Math.toIntExact(id)).orElseThrow();
    if(machine.getStatus()==MachineStatus.STOPPED){
      machine.setActive(false);
      machineRepository.save(machine);
    }else{
      throw  new RuntimeException("Machine must be STOPPED to be destroyed");
    }
  }
}
