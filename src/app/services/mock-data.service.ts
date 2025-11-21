import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {Machine} from "../models/machine.model";
import {MachineError} from "../models/machine-error.model";

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  users: User[] = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@raf.rs',password:'admin',
      permissions: ['add_user', 'read_user', 'edit_user', 'delete_user', //dozvole sto se tice korisnika
        'search_machine','create_machine','destroy_machine','start_machine','stop_machine','restart_machine','read_errors'] }, //dozvole sto se tice masina
    { id: 2, firstName: 'Pera', lastName: 'Peric', email: 'pera@raf.rs',
      permissions: ['read_user','create_machine','search_machine','read_errors'] },
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

  isAdmin(){
    return this.loggedUser?.email === 'admin@raf.rs';
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


  //mock masine
  private machines: Machine[]=[
    {
      id:1,
      name:'Engine A',
      status:'OFF',
      createdBy: 1,
      active:true,
      createdAt:"2025-01-01"
    },
    {
      id:2,
      name:'Engine B',
      status:'OFF',
      createdBy: 2,
      active:true,
      createdAt:"2025-02-01"
    }
  ];
  getMachines():Machine[]{
    return this.machines;
  }
  addMachines(machine:Machine){
    this.machines.push(machine);
  }

  destroyMachine(id:number){
    const machine = this.machines.find(m => m.id === id);
    if (!machine) return;

    // soft delete
    machine.active = false;
  }


  //MOCK MACHINE ERRORS
  private errors: MachineError[] = [
    {
      date: "2025-11-20T14:22:00",
      machineId: 1,
      operation: "start",
      message: "Masin je vec ON. Ne moze se upaliti opet."
    },
    {
      date: "2025-11-21T09:10:00",
      machineId: 1,
      operation: "stop",
      message: "Masina je vec OFF. Ne moze se ugasiti."
    },
    {
      date: "2025-11-21T16:45:00",
      machineId: 2,
      operation: "restart",
      message: "Masina je OFF. Ne moze se restartovati dok je OFF."
    },
    {
      date: "2025-11-22T11:20:00",
      machineId: 2,
      operation: "start",
      message: "Korisnik nema dozvolu da upali ovu masinu."
    }
  ];



  getErrorsForUser(userId:number,isAdmin:boolean){
    if(isAdmin) return this.errors;
    return this.errors.filter(err=>{
      const machine = this.machines.find(m=>m.id === err.machineId);
      return machine?.createdBy === userId;
    });
  }

  /* addError(error: MachineError){
    this.errors.push(error);
  } */
}
