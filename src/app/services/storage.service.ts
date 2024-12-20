import { Injectable } from '@angular/core';
import '@capacitor-community/sqlite';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Storage } from '@capacitor/storage';
import { Device } from '@capacitor/device';

const DB_SETUP_KEY = 'trx_db_setup';
const DB_NAME_KEY = 'TRX_DB';

@Injectable({ 
  providedIn: 'root',
})
export class StorageService {
  dbName = '';

  async init(): Promise<void> {
    const info = await Device.getInfo();

    if (info.platform === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDatabase();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.setupDatabase();
    }
  }

  clear(): Promise<any> {
    return Storage.clear();
  }

  remove(key: string): Promise<any> {
    return Storage.remove({ key });
  }

  set(key: string, value: any): Promise<any> {
    return Storage.set({ key, value: JSON.stringify(value) });
  }

  get(key: string): Promise<any> {
    return Storage.get({ key });
  }

  private async setupDatabase() {
    const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });

    if (dbSetupDone.value) {
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value!;
      await CapacitorSQLite.open({ database: this.dbName });
    }
  }
}
