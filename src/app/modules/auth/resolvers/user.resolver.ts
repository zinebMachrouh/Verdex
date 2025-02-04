import { ResolveFn } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const userResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);
  return authService.currentUser$;
};
