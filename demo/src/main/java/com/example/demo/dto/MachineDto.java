package com.example.demo.dto;

import com.example.demo.entity.MachineStatus;
import lombok.Data;

@Data
public class MachineDto {
  private Long id;
  private String name;
  private MachineStatus status;
  private boolean active;
  private boolean busy;
}
