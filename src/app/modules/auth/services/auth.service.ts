import { Injectable } from '@angular/core';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {IndxeddbService} from "../../../core/services/indxeddb.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionExpiry = 45 * 60 * 1000;

  constructor(private dbService: IndxeddbService) {}

  async register(formData: FormData, profilePicture: File | null): Promise<string> {
    try {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const address = formData.get('address') as string;
      const birthday = formData.get('birthday') as string;
      const role = formData.get('role') as string;

      if (!email || !password || !name || !phone || !address || !birthday || !role) {
        throw new Error('Missing required registration fields');
      }

      const existingUsers = await this.dbService.getAll('users');
      if (existingUsers.some(u => u.email === email)) {
        return 'Email already registered';
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const id = uuidv4();
      const user = {
        id,
        email,
        password: hashedPassword,
        name,
        phone,
        address,
        birthday,
        role,
        active: true,
        picture: profilePicture ? await this.convertImageToBase64(profilePicture) : ''
      };

      console.log('Registering user', user);
      await this.dbService.add('users', user);
      return 'Registration successful';
    } catch (error) {
      console.error('Registration failed', error);
      return 'Registration failed';
    }
  }


  async login(email: string, password: string): Promise<string> {
    try {
      const users = await this.dbService.getAll('users');
      const user = users.find(u => u.email === email);
      if (!user) {
        return 'Account does not exist';
      }
      if (!user.active) {
        return 'Account is not active';
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return 'Incorrect password';
      }
      this.startSession(user);
      return 'Login successful';
    } catch (error) {
      console.error('Login failed', error);
      return 'Login failed';
    }
  }

  private startSession(user: any): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    setTimeout(() => {
      sessionStorage.removeItem('currentUser');
      alert('Session expired. Please login again.');
    }, this.sessionExpiry);
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
