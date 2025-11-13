import { Component } from '@angular/core';
import {User} from "../../../models/user.model";
import {MockDataService} from "../../../services/mock-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: User[]= [];
  constructor(private mockService: MockDataService, private router: Router) {
  }
  ngOnInit(){
    this.users=this.mockService.getUsers();
  }
  goToEdit(user:User){
    this.router.navigate(['/users',user.id,'edit']);
  }
  goToAdd(){
    this.router.navigate(['/users/add'])
  }
  deleteUser(id:number){
    if(confirm("Potvrdi brisanje")){
      this.mockService.deleteUser(id);
      this.users=this.mockService.getUsers();
    }
  }
}
