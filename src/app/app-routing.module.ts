import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {UserListComponent} from "./pages/users/user-list/user-list.component";
import {UserAddComponent} from "./pages/users/user-add/user-add.component";
import {UserEditComponent} from "./pages/users/user-edit/user-edit.component";
import {PermissionGuard} from "./guards/permission.guard";
import {MachineListComponent} from "./pages/machines/machine-list/machine-list.component";
import {MachineErrorComponent} from "./pages/machines/machine-error/machine-error.component";
import {MachineCreateComponent} from "./pages/machines/machine-create/machine-create.component";

const routes: Routes = [{
  path:'',redirectTo:'login',pathMatch:'full'},

  {path:'login',component: LoginComponent},

  {path:'users',component: UserListComponent, canActivate:[PermissionGuard],
    data:{permission: 'read_user'}},

  {path:'users/add',component:UserAddComponent, canActivate: [PermissionGuard],
    data: { permission: 'add_user' }},

  {path:'users/:id/edit',component:UserEditComponent, canActivate: [PermissionGuard],
    data: { permission: 'edit_user' }},

  //rute za masine

  {path:'machines', component:MachineListComponent, canActivate:[PermissionGuard],
    data:{permission: 'search_machine'}},

  {
    path: 'machines/errors', component: MachineErrorComponent, canActivate: [PermissionGuard],
    data: { permission: 'read_errors' }//nije neophodan, samo mi je bilo lakse
  },

  {path:'machines/create', component:MachineCreateComponent, canActivate:[PermissionGuard],
    data:{permission: 'create_machine'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
