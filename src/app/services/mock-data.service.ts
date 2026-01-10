import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {Machine} from "../models/machine.model";
import {MachineError} from "../models/machine-error.model";

import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private http = inject(HttpClient); // Koristi inject() ili konstruktor
    private apiUrl = 'http://localhost:3000/api';

    // Umesto niza, sada vraća Observable
    getMachines(): Observable<Machine[]> {
      return this.http.get<Machine[]>(`${this.apiUrl}/machines`);
    }

    // Login sada šalje zahtev backendu
    login(credentials: any) {
      return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.setLoggedUser(res.user);
        })
      );
    }

  /*loggedUser: User | null=null;

  setLoggedUser(user:User){
    this.loggedUser=user;
  }
  getLoggedUser(): User|null{
    return this.loggedUser;
  }

  isAdmin(){
    return this.loggedUser?.email === 'admin@raf.rs';
  }

  /*getUsers() {
    return this.users;
  }

  addUser(user: User) {
    this.users.push(user);
  }*/

  /*getUserById(id: number) {
    return this.users.find(u => u.id === id);
  }*/

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



  /*getMachines():Machine[]{
    return this.machines;
  }*/
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




  /*getErrorsForUser(userId:number,isAdmin:boolean){
    if(isAdmin) return this.errors;
    return this.errors.filter(err=>{
      const machine = this.machines.find(m=>m.id === err.machineId);
      return machine?.createdBy === userId;
    });
  }*/

  /* addError(error: MachineError){
    this.errors.push(error);
  } */
}
