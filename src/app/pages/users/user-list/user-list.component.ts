import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service'; // <--- NOVI SERVIS
import { AuthService } from '../../../services/auth.service'; // <--- ZA ULOGOVANOG

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loggedUser: User | null = null; // Ovo sad vadimo iz tokena/servisa

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Dohvati sve korisnike sa backenda
    this.userService.getAllUsers().subscribe({
        next: (data) => this.users = data,
        error: (err) => console.error(err)
    });

    // 2. Provera ko je ulogovan (ne vracamo ceo objekat, samo email/permisije iz tokena)
    // Ako ti bas treba ceo user objekat ulogovanog, morao bi da ga dovuces sa backenda
    // Za sad cemo samo proveriti permisije direktno u HTML-u preko authService
  }

  goToEdit(user: User) {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  goToAdd() {
    this.router.navigate(['/users/add']);
  }

  deleteUser(id: number) {
    if (confirm("Potvrdi brisanje")) {
      this.userService.deleteUser(id).subscribe(() => {
        // Osvezi listu nakon brisanja
        this.users = this.users.filter(u => u.id !== id);
      });
    }
  }
}
