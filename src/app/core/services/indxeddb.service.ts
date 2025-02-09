import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class IndxeddbService {
  private dbName = 'VerdexDB';
  private dbVersion = 3;
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
          userStore.createIndex('picture', 'picture');

          const requestStore = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
          requestStore.createIndex('user_id', 'user_id');
          requestStore.createIndex('collector_id', 'collector_id');
          requestStore.createIndex('types', 'types');
          requestStore.createIndex('weight', 'weight');
          requestStore.createIndex('status', 'status');
          requestStore.createIndex('address', 'address');
          requestStore.createIndex('schedule', 'schedule');
          requestStore.createIndex('points', 'points');
          requestStore.createIndex('photos', 'photos');
          requestStore.createIndex('notes', 'notes');
        }

        const salt = bcrypt.genSaltSync(10);
        if (oldVersion < 2) {
          const userStore = transaction.objectStore('users');
          const collectors = [
            {
              id: uuidv4(),
              email: 'liam@verdex.com',
              password: bcrypt.hashSync("password123", salt),
              name: 'Liam Smith',
              address: '123 Main St, New York, NY',
              phone: '0612345678',
              birthday: '1990-01-01',
              role: 'collector',
              active: true,
              picture: ""
            },
            {
              id: uuidv4(),
              email: 'noah@verdex.com',
              password: bcrypt.hashSync("password123", salt),
              name: 'Noah Miller',
              address: '123 Hill St, Los Angeles, CA',
              phone: '0612345684',
              birthday: '1990-01-01',
              role: 'collector',
              active: true,
              picture: ""
            },
            {
              id: uuidv4(),
              email: 'adam@verdex.com',
              password: bcrypt.hashSync("password123", salt),
              name: 'Adam Brown',
              address: '123 River St, Chicago, IL',
              phone: '0612345688',
              birthday: '1990-01-01',
              role: 'collector',
              active: true,
              picture: ""
            }
          ];

          collectors.forEach(user => {
            userStore.add(user);
          });
        }

      }
    });
  }

  async storeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async getImageBlob(table: string, key: any): Promise<string | null> {
    const record = await this.get(table, key);
    return record?.picture || record?.photo || null;
  }

  async getAll(table: string): Promise<any[]> {
    return this.db.then(db => db.getAll(table));
  }

  async get(table: string, key: any): Promise<any> {
    return this.db.then(db => db.get(table, key));
  }

  async add(table: string, value: any): Promise<any> {
    return this.db.then(db => db.add(table, value));
  }

  async put(table: string, value: any): Promise<any> {
    return this.db.then(db => db.put(table, value));
  }

  async delete(table: string, key: any): Promise<any> {
    return this.db.then(db => db.delete(table, key));
  }
}
