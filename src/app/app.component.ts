import { Component } from '@angular/core';
import {MockDataService} from "./services/mock-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'napredniVebJH1622PM14223';

  isLoggedIn = false;

  constructor(public mockService: MockDataService, private router: Router) {}

  ngOnInit(): void {

    const saved = localStorage.getItem('loggedUser');

    if (saved) {
      this.mockService.setLoggedUser(JSON.parse(saved));
      this.isLoggedIn = true;
    }


    this.isLoggedIn = this.mockService.getLoggedUser() !== null;
  }

  logout() {
    this.mockService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
