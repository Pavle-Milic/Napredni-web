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
    const user = this.mockService.getUsers().find(u =>u.email === this.email);
    if(user){
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('loggedUser', JSON.stringify(user));
      this.router.navigate(['/users']);
    }else{
      this.error="Korisnik sa unetim mailom ne postoji.";
    }
  }
}
