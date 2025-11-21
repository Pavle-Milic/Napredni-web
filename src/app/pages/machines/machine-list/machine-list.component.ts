import {Component, OnInit} from '@angular/core';
import {Machine} from "../../../models/machine.model";
import {MockDataService} from "../../../services/mock-data.service";
import {Router} from "@angular/router";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit{
  machines: Machine[]=[];
  filteredMachines:Machine[]=[];
  user:User|null=null;

  filters={
    name:'',
    status:'',
    startDate:'',
    endDate:''
  };
  constructor(private mockService: MockDataService, private router: Router) {
  }
  ngOnInit() {
    this.user=this.mockService.getLoggedUser();
    const allMachines=this.mockService.getMachines();

    if(this.mockService.isAdmin()){
      this.machines=allMachines.filter(m=>m.active);
    }else{
      this.machines=allMachines.filter(m=> m.active && m.createdBy===this.user?.id);
    }
    this.filteredMachines=[...this.machines];
  }

  search(){
    this.filteredMachines=this.machines.filter(m=>{
      const nameOk=this.filters.name ?
        m.name.toLowerCase().includes(this.filters.name.toLowerCase()) : true;

      const statusOk= this.filters.status ?
        m.status===this.filters.status : true;

      const startOk=this.filters.startDate ?
        new Date(m.createdAt) >= new Date(this.filters.startDate) : true;

      const endOk=this.filters.endDate ?
        new Date(m.createdAt) <= new Date(this.filters.endDate) : true;
      return nameOk && statusOk && startOk && endOk;
    });
  }

  goToCreate(){
    this.router.navigate(['/machines/create']);
  }
  destroyMachine(id:number){
    if(confirm("Potvrdi brisanje")){
      this.mockService.destroyMachine(id);
      this.machines = this.machines.filter(m => m.id !== id);
      this.filteredMachines = this.filteredMachines.filter(m => m.id !== id);
    }
  }
}
