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
        next: (data) => this.errors = data,
        error: (err) => console.error(err)
    });
  }
}
