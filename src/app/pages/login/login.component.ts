import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MockDataService} from "../../services/mock-data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private router: Router,
              private mockService: MockDataService) {
  }
  login(){
    const user =
      this.mockService.getUsers().find(u =>u.email === this.email && (u.password ?? "")===(this.password??""));
    if(user){
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('loggedUser', JSON.stringify(user));
      this.mockService.setLoggedUser(user);
      if(user.permissions?.includes('read_user'))
        this.router.navigate(['/users']);
      else {
        this.error="Nemate dozvolu da vidite listu korisnika.";
      }
    }else{
      this.error="Korisnik sa unetim mailom ili sifrom ne postoji.";
    }
  }
}
