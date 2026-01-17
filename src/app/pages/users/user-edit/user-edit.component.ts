import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User = { id: 0, firstName: '', lastName: '', email: '', permissions: [], password: '' };
  error = '';

  // Definisemo sve moguce permisije ovde da bi HTML bio cistiji
  allPermissions = [
    'read_user', 'add_user', 'edit_user', 'delete_user',
    'search_machine', 'start_machine', 'stop_machine', 'restart_machine',
    'create_machine', 'destroy_machine', 'read_errors'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        // Backend cesto ne vraca password, pa ga setujemo na prazan string
        // da ne bi bio undefined
        this.user.password = '';
      },
      error: () => this.error = 'Korisnik nije pronadjen'
    });
  }

  togglePermission(permission: string) {
    if (this.user.permissions.includes(permission)) {
      this.user.permissions = this.user.permissions.filter(p => p !== permission);
    } else {
      this.user.permissions.push(permission);
    }
  }

  saveChanges() {
    this.userService.updateUser(this.user).subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => this.error = 'Greska pri izmeni.'
    });
  }
}
