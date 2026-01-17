import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MachinesApiService} from "../../../services/machines-api.service";


@Component({
  selector: 'app-machine-schedule',
  templateUrl: './machine-schedule.component.html'
})
export class MachineScheduleComponent implements OnInit {
  machineId: number = 0;
  operation: string = 'START';
  scheduledTime: string = ''; // Vezuje se za input
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private machinesApi: MachinesApiService
  ) {}

  ngOnInit() {
    // Uzimamo ID iz URL-a
    this.machineId = Number(this.route.snapshot.paramMap.get('id'));
  }

  schedule() {
    if(!this.scheduledTime) {
      this.error = 'Morate izabrati datum i vreme!';
      return;
    }

    // Pozivamo odgovarajucu metodu iz servisa na osnovu dropdown-a
    let observable;
    if (this.operation === 'START') {
      observable = this.machinesApi.startMachine(this.machineId, this.scheduledTime);
    } else if (this.operation === 'STOP') {
      observable = this.machinesApi.stopMachine(this.machineId, this.scheduledTime);
    } else {
      observable = this.machinesApi.restartMachine(this.machineId, this.scheduledTime);
    }

    observable.subscribe({
      next: () => {
        alert('Uspešno zakazano!');
        this.router.navigate(['/machines']); // Vracamo se na listu
      },
      error: (err) => {
        console.error(err);
        this.error = 'Greška pri zakazivanju (proveri format datuma ili permisije).';
      }
    });
  }
}
