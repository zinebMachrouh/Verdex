import { Injectable } from '@angular/core';
import { IndxeddbService } from "../../../core/services/indxeddb.service";
import { BehaviorSubject } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private sessionTimeout: any;
  private sessionDuration = 60 * 60 * 1000;

  constructor(private dbService: IndxeddbService) {
    this.restoreSession();
  }

  async register(user: any): Promise<string> {
    const existingUsers = await this.dbService.getAll('users');
    if (existingUsers.some(u => u.email === user.email)) {
      return 'Email already registered';
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    user.id = uuidv4();
    await this.dbService.add('users', user);
    return 'Registration successful';
  }

  async login(email: string, password: string): Promise<string> {
    const users = await this.dbService.getAll('users');
    const user = users.find(u => u.email === email);

    if (!user.active) {
      return 'Account is not active';
    }else if (!user){
      return 'Account does not exist';
    }else if(!bcrypt.compareSync(password, user.password)){
      return 'Incorrect password';
    }

    this.startSession(user);
    return 'Login successful';
  }

  logout(): void {
    this.clearSession();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  private startSession(user: any): void {
    this.currentUserSubject.next(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    this.clearSessionTimeout();

    this.sessionTimeout = setTimeout(() => {
      this.logout();
      alert('Session expired. Please log in again.');
    }, this.sessionDuration);
  }

  private clearSession(): void {
    this.clearSessionTimeout();
    sessionStorage.removeItem('currentUser');
  }

  private clearSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  private restoreSession(): void {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.startSession(JSON.parse(user));
    }
  }
}
