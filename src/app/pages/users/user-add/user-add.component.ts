import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service'; // <--- NOVI SERVIS

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = ''; // Dodajemo polje za password (backend trazi)
  permissions: string[] = [];
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  togglePermissions(permission: string) {
    if (this.permissions.includes(permission)) {
      this.permissions = this.permissions.filter(p => p !== permission);
    } else {
      this.permissions.push(permission);
    }
  }

  addUser() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.error = 'Sva polja su obavezna.';
      return;
    }

    const newUser: User = {
      // ID ne saljemo, backend generise
      id: 0,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password, // Backend ce ovo da enkriptuje
      permissions: this.permissions
    };

    this.userService.createUser(newUser).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => this.error = 'Greška pri kreiranju korisnika.'
    });
  }
}
