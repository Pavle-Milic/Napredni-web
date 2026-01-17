import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserAddComponent } from './pages/users/user-add/user-add.component';
import { UserEditComponent } from './pages/users/user-edit/user-edit.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MachineListComponent } from './pages/machines/machine-list/machine-list.component';
import { MachineErrorComponent } from './pages/machines/machine-error/machine-error.component';
import { MachineCreateComponent } from './pages/machines/machine-create/machine-create.component';
import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    MachineListComponent,
    MachineErrorComponent,
    MachineCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
              {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
