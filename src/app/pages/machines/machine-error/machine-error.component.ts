import { Component, OnInit } from '@angular/core';
import { MachineError } from '../../../models/machine-error.model';
import { MachinesApiService } from '../../../services/machines-api.service';

@Component({
  selector: 'app-machine-error',
  templateUrl: './machine-error.component.html',
  styleUrls: ['./machine-error.component.css']
})
export class MachineErrorComponent implements OnInit {
  errors: MachineError[] = [];

  constructor(private machinesApi: MachinesApiService) {}

  ngOnInit() {
    this.machinesApi.getErrors().subscribe({
      next: (data) => {
        this.errors = data;
        // Opciono: Sortiramo da najnovije greske budu prve na listi
        this.errors.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (err) => console.error("Nisam uspeo da učitam greške:", err)
    });
  }
}
