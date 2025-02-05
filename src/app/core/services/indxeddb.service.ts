import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class IndxeddbService {
  private dbName = 'VerdexDB';
  private dbVersion = 2;
  private readonly db: Promise<IDBPDatabase>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, this.dbVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('password', 'password');
          userStore.createIndex('name', 'name');
          userStore.createIndex('address', 'address');
          userStore.createIndex('phone', 'phone', { unique: true });
          userStore.createIndex('birthday', 'birthday');
          userStore.createIndex('role', 'role');

          const requestStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
          requestStore.createIndex('user_id', 'user_id');
          requestStore.createIndex('collector_id', 'collector_id');
          requestStore.createIndex('type', 'type');
          requestStore.createIndex('weight', 'weight');
          requestStore.createIndex('status', 'status');
          requestStore.createIndex('address', 'address');
          requestStore.createIndex('schedule', 'schedule');
          requestStore.createIndex('points', 'points');
        }
        const salt = bcrypt.genSaltSync(10);
        if (oldVersion < 2) {
          const userStore = transaction.objectStore('users');
          userStore.add({
            id : uuidv4(),
            email: 'liam@verdex.com',
            password: bcrypt.hashSync("password123", salt),
            name: 'Liam Smith',
            address: '123 Main St, New York, NY',
            phone: '0612345678',
            birthday: '1990-01-01',
            role: 'collector'
          });
        }
      }
    });
  }

  getAll(table: string): Promise<any[]> {
    return this.db.then(db => db.getAll(table));
  }

  get(table: string, key: any): Promise<any> {
    return this.db.then(db => db.get(table, key));
  }

  add(table: string, value: any): Promise<any> {
    return this.db.then(db => db.add(table, value));
  }

  put(table: string, value: any): Promise<any> {
    return this.db.then(db => db.put(table, value));
  }

  delete(table: string, key: any): Promise<any> {
    return this.db.then(db => db.delete(table, key));
  }
}
