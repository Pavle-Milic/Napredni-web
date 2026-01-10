import { Component } from '@angular/core';
import {MockDataService} from "../../../services/mock-data.service";
import {Router} from "@angular/router";
import {Machine} from "../../../models/machine.model";
import {MachinesApiService} from "../../../services/machines-api.service"

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent {
  name='';
  error='';

  constructor(private machinesApi: MachinesApiService,
              private router: Router) {
  }

  createMachine(){
    if(!this.name){
      this.error='Ime je obavezno.';
      return;
    }

    const user= this.machinesApi.getLoggedUser();

    if(!user){
      return; //inace puca pri pravljenju masine
    }

    const newMachine:Machine={
      id: Date.now(),
      name: this.name,
      status: 'OFF',
      createdBy:user.id,
      active:true,
      createdAt: new Date().toISOString()
    };

    this.machinesApi.addMachines(newMachine);

    this.router.navigate(['/machines']);
  }
}
