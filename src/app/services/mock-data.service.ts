import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  users: User[] = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@raf.rs', permissions: ['create_user', 'read_user', 'update_user', 'delete_user'] },
    { id: 2, firstName: 'Pera', lastName: 'Peric', email: 'pera@raf.rs', permissions: ['read_user'] }
  ];

  getUsers() {
    return this.users;
  }

  addUser(user: User) {
    this.users.push(user);
  }

  getUserById(id: number) {
    return this.users.find(u => u.id === id);
  }

  updateUser(user: User) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}
