import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Machine } from '../../../models/machine.model';
import { MachinesApiService } from '../../../services/machines-api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {
  machines: Machine[] = [];
  filteredMachines: Machine[] = []; // <--- Vraceno zbog HTML-a

  // Filter objekat
  filters = {
    name: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  constructor(
    private machinesApi: MachinesApiService,
    public authService: AuthService, // <--- Public zbog HTML-a
    private router: Router // <--- Router za navigaciju
  ) {}

  ngOnInit() {
    this.loadMachines();
  }

  loadMachines() {
    this.machinesApi.search(this.filters).subscribe({
      next: (data) => {
        this.machines = data;
        this.filteredMachines = data; // <--- Inicijalno su isto
      },
      error: (err) => console.error(err)
    });
  }

  search() {
    // Backend search
    this.loadMachines();
  }

  goToCreate() {
    this.router.navigate(['/machines/create']);
  }

  // Akcije
  startMachine(id: number) {
    this.machinesApi.startMachine(id).subscribe(() => this.loadMachines());
  }

  stopMachine(id: number) {
    this.machinesApi.stopMachine(id).subscribe(() => this.loadMachines());
  }

  restartMachine(id: number) {
    this.machinesApi.restartMachine(id).subscribe(() => this.loadMachines());
  }

  destroyMachine(id: number) {
    if(confirm("Da li ste sigurni?")) {
      this.machinesApi.destroy(id).subscribe(() => this.loadMachines());
    }
  }
}
