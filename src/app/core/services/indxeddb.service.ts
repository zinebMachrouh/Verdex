import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class IndxeddbService {
  private dbName = 'VerdexDB';
  private dbVersion = 1;
  private readonly db : Promise<IDBPDatabase>

  constructor() {
    this.db = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase> {
    return openDB(this.dbName, this.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id'});
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('password', 'password', { unique: false });
          userStore.createIndex('name', 'name', { unique: false });
          userStore.createIndex('address', 'address', { unique: false });
          userStore.createIndex('phone', 'phone', { unique: true });
          userStore.createIndex('birthday', 'birthday', { unique: false });
          userStore.createIndex('role', 'role', { unique: false });
        }

        if (!db.objectStoreNames.contains('requests')){
          const requestStore = db.createObjectStore('requests', { keyPath: 'id'});
          requestStore.createIndex('user_id', 'user_id', { unique: false });
          requestStore.createIndex('collector_id', 'collector_id', { unique: false });
          requestStore.createIndex('type', 'type', { unique: false });
          requestStore.createIndex('weight', 'weight', { unique: false });
          requestStore.createIndex('status', 'status', { unique: false });
          requestStore.createIndex('address', 'address', { unique: false });
          requestStore.createIndex('schedule', 'schedule', { unique: false });
          requestStore.createIndex('points', 'points', { unique: false });

        }
      }
    })
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
