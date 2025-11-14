import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  users: User[] = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@raf.rs',password:'admin', permissions: ['add_user', 'read_user', 'edit_user', 'delete_user'] },
    { id: 2, firstName: 'Pera', lastName: 'Peric', email: 'pera@raf.rs', permissions: ['read_user'] },
    { id: 3, firstName: 'Mika', lastName: 'Antic', email: 'mika@raf.rs', permissions: []}
  ];

  loggedUser: User | null=null;

  setLoggedUser(user:User){
    this.loggedUser=user;
  }
  getLoggedUser(): User|null{
    return this.loggedUser;
  }

  getUsers() {
    return this.users;
  }

  addUser(user: User) {
    this.users.push(user);
  }

  getUserById(id: number) {
    return this.users.find(u => u.id === id);
  }

  editUser(user: User) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  deleteUser(id:number){
    this.users=this.users.filter(u=>u.id !==id);
  }
}
