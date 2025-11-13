import { Component } from '@angular/core';
import {User} from "../../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {MockDataService} from "../../../services/mock-data.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  user!:User;
  error='';

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private mockService: MockDataService

  ) {
  }
  ngOnInit(){
    const id= Number(this.route.snapshot.paramMap.get('id'));
    const foundUser = this.mockService.getUsers().find(u=>u.id===id);
    if(foundUser){
      this.user={...foundUser};
    }else{
      this.error='Korisnik nije pronadjen'
    }
  }
  togglePermission(permission: string) {
    if (this.user.permissions.includes(permission)) {
      this.user.permissions = this.user.permissions.filter(p => p !== permission);
    } else {
      this.user.permissions.push(permission);
    }
  }
  saveChanges(){
    const index=this.mockService.users.findIndex(u=>u.id === this.user.id);
    if(index!==-1){
      this.mockService.users[index]=this.user;
      this.router.navigate(['/users']);
    }else{
      this.error='Greska pri azuriranju';
    }
  }
}
