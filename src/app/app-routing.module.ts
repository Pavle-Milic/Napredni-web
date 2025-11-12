import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {UserListComponent} from "./pages/users/user-list/user-list.component";
import {UserAddComponent} from "./pages/users/user-add/user-add.component";
import {UserEditComponent} from "./pages/users/user-edit/user-edit.component";

const routes: Routes = [{
  path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component: LoginComponent},
  {path:'users',component: UserListComponent},
  {path:'users/add',component:UserAddComponent},
  {path:'user/:id/edit',component:UserEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
