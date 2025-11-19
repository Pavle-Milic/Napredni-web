import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {Machine} from "../models/machine.model";

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  users: User[] = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@raf.rs',password:'admin',
      permissions: ['add_user', 'read_user', 'edit_user', 'delete_user', //dozvole sto se tice korisnika
        'search_machine','create_machine','destroy_machine','start_machine','stop_machine','restart_machine'] }, //dozvole sto se tice masina
    { id: 2, firstName: 'Pera', lastName: 'Peric', email: 'pera@raf.rs',
      permissions: ['read_user','create_machine','search_machine'] },
    { id: 3, firstName: 'Mika', lastName: 'Antic', email: 'mika@raf.rs',
      permissions: []}
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

  logout() {
    this.loggedUser = null;
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('token');
  }

  private machines: Machine[]=[
    {
      id:1,
      name:'Engine A',
      status:'OFF',
      createdBy: 1,
      active:true,
      createdAt:"2024-01-01"
    }
  ];
  getMachines():Machine[]{
    return this.machines;
  }
  addMachines(machine:Machine){
    this.machines.push(machine);
  }
}
