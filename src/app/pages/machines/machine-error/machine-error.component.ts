import { Component } from '@angular/core';
import {MachineError} from "../../../models/machine-error.model";
import {MockDataService} from "../../../services/mock-data.service";

@Component({
  selector: 'app-machine-error',
  templateUrl: './machine-error.component.html',
  styleUrls: ['./machine-error.component.css']
})
export class MachineErrorComponent {
  errors: MachineError[]=[];

  constructor(private mockService: MockDataService) {
  }

  ngOnInit(){
    const user= this.mockService.getLoggedUser();
    if(!user) return;

    this.errors=this.mockService.getErrorsForUser(user.id,this.mockService.isAdmin());
  }
}
