import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import {AuthService} from "../services/auth.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login'])
      .then(nav => {
        console.log(nav);
      }, err => {
        console.log(err)
      });
    return false;
  }
};
