import { Routes } from '@angular/router';
import {HomeComponent} from "./shared/components/home/home.component";
import {LoginComponent} from "./modules/auth/components/login/login.component";
import {RegisterComponent} from "./modules/auth/components/register/register.component";
import {DashboardComponent} from "./shared/components/dashboard/dashboard.component";
import {AuthGuard} from "./modules/auth/guards/auth.guard";
import {userResolver} from "./modules/auth/resolvers/user.resolver";

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path:'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: userResolver
    }
  }
];
