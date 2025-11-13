import { Component } from '@angular/core';
import {MockDataService} from "../../../services/mock-data.service";
import {Router} from "@angular/router";
import {User} from "../../../models/user.model";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  firstName='';
  lastName='';
  email='';
  permissions: string[]=[];
  error='';
  constructor(private mockService: MockDataService, private router: Router) {
  }
  togglePermissions(permission: string){
    if(this.permissions.includes(permission)){
      this.permissions =this.permissions.filter(p => p!==permission);
    }else{
      this.permissions.push(permission);
    }
  }
  addUser(){
    if(!this.firstName || !this.lastName || !this.email){
      this.error='Sva polja su obavezna.';
      return;
    }
    const newUser:User={
      id:Math.floor(Math.random()*10000),
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,
      permissions:this.permissions
    };
    this.mockService.addUser(newUser);
    this.router.navigate(['/users']);
  }
}
