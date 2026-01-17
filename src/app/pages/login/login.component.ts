import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log("Login uspešan, preusmeravam...");

        // Provera da li ruta postoji pre navigacije
        this.router.navigate(['/machines'])
          .then(success => {
            if(!success) console.error("Navigacija nije uspela! Proveri app-routing.module.ts");
          });
      },
      error: (err) => {
        console.error("Login greska:", err);
        this.error = 'Neispravan email ili lozinka.';
      }
    });
  }
}
