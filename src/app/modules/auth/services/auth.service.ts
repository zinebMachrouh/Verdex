import { Injectable } from '@angular/core';
import {IndxeddbService} from "../../../core/services/indxeddb.service";
import {BehaviorSubject} from "rxjs";
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private dbService: IndxeddbService) {}

  async register(user: any): Promise<string> {
    const existingUsers = await this.dbService.getAll('users');
    if (existingUsers.some(u => u.email === user.email)) {
      return 'Email already registered';
    }
    user.id = uuidv4(); // Generate a unique ID for the user
    await this.dbService.add('users', user);
    return 'Registration successful';
  }

  async login(email: string, password: string): Promise<string> {
    const users = await this.dbService.getAll('users');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return 'Invalid email or password';
    }

    this.currentUserSubject.next(user);
    return 'Login successful';
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  async getCurrentUser(): Promise<any | null> {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
