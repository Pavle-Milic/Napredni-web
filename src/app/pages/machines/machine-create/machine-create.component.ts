import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MachinesApiService } from '../../../services/machines-api.service';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent {
  name = '';
  error = '';

  constructor(
    private machinesApi: MachinesApiService,
    private router: Router
  ) {}

  createMachine() {
    if (!this.name) {
      this.error = 'Ime je obavezno.';
      return;
    }

    // Backend sam dodeljuje usera na osnovu tokena! Ne moras da ga saljes.
    this.machinesApi.create(this.name).subscribe({
        next: () => this.router.navigate(['/machines']),
        error: (err) => this.error = 'Greška pri kreiranju mašine.'
    });
  }
}
