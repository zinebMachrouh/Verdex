import { Routes } from '@angular/router';
import {HomeComponent} from "./shared/components/home/home.component";
import {LoginComponent} from "./modules/auth/components/login/login.component";
import {RegisterComponent} from "./modules/auth/components/register/register.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
];
