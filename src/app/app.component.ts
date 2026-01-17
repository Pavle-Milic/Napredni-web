import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'napredniVebJH1622PM14223';

  isLoggedIn = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout() {
      this.authService.clearToken();
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
  }
}
