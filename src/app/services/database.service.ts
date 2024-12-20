import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DBService {
  private dbName = 'db';
  private storeNames = ['fields', 'farms', 'hay_types', 'hay_cuts', 'time_minutes', 'time_hours', 'production_transactions', 'created_production_transactions', 'updated_production_transactions'];
  private db: IDBDatabase | null = null;

  constructor() {
  }

  private async openDatabase(): Promise<any> {    
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        for (let storeName of this.storeNames) {
          let storage = db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });

          var indexNames = storage.indexNames;
          console.log('Index name:', indexNames);
        }
      };
  
      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('Connected to the IndexedDB database.');
        resolve(this.db)
      };
  
      request.onerror = (event: Event) => {
        console.error(
          `Error opening database: ${(event.target as IDBOpenDBRequest).error}`
        );
        reject(`Error opening database: ${(event.target as IDBOpenDBRequest).error}`)
      };
    })
  }

  public async addData(storeName: string, data: any) {
    if (!this.db) {
     this.db = await this.openDatabase()
    }

    const transaction: any = this.db?.transaction( storeName, 'readwrite');

    const objectStore: IDBObjectStore = transaction.objectStore(storeName);

    const addRequest: IDBRequest<IDBValidKey> = objectStore.add(data);

    addRequest.onsuccess = () => {
      // console.log('Data added successfully:', data);
    };

    addRequest.onerror = (event: Event) => {
      // console.error('Error adding data:', (event.target as IDBRequest).error);
    };

    transaction.oncomplete = () => {
      console.log('Transaction completed.');
      return {status: 'ok', message: 'Added in local db'};
    };

    transaction.onerror = (event: Event) => {
      console.error(
        'Transaction error:',
        (event.target as IDBTransaction).error
      );
      return {status: 'error', message: (event.target as IDBTransaction).error};
    };
  }

  public async clearStorage(storeName: string) {
   if (!this.db) {
     this.db = await this.openDatabase()
    }

    return new Promise<void>((resolve, reject) => {
      const transaction: any = this.db?.transaction([storeName], 'readwrite');
      const objectStore: any = transaction.objectStore(storeName);
      const clearRequest: any = objectStore.clear();

      clearRequest.onsuccess = () => {
          console.log('Object store cleared successfully.');
          resolve();
      };

      clearRequest.onerror = (event: Event) => {
          console.error(
              'Error clearing object store:',
              (event.target as IDBRequest).error
          );
          reject((event.target as IDBRequest).error);
      };
  });
  }

  public async getAll(storeName: string):Promise<any> {
    if (!this.db) {
      this.db = await this.openDatabase()
     }
     console.log(this.db)
    let transaction: any = this.db?.transaction([storeName], 'readonly');
    let objectStore = transaction.objectStore(storeName);
    console.log(objectStore)
    let cursorRequest = objectStore.openCursor();

    return new Promise((resolve, reject) => {
      const records: any[] = [];

      cursorRequest.onsuccess = (event: Event): void => {
        const cursor = (event.target as IDBRequest)
          .result as IDBCursorWithValue;

        if (cursor) {
          const record = cursor.value;
          records.push(record);
          cursor.continue();
        } else {
          console.log('All records retrieved.');
          resolve(records);
        }
      };

      cursorRequest.onerror = (event: Event): void => {
        console.log('Error while retrieving Data');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  updateRow(storeName: string, record_id: number, new_row: any) {
    if (!this.db) {
      console.error('Database not available.');
      return;
    }

    const transaction = this.db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const recordIdToUpdate = record_id;

    let userIndex = objectStore.index('PK_ID');
    const getRequest: IDBRequest | undefined = userIndex.get(record_id);
    
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = (event: Event) => {
        const existingRecord: any = (event.target as IDBRequest).result;
        console.log('ex rec', existingRecord);
        if (existingRecord) {
          existingRecord.propertyToUpdate = new_row;
          let new_object = { ...new_row, id: existingRecord.id };
          const putRequest: IDBRequest = objectStore.put(new_object);

          putRequest.onsuccess = (putEvent: Event) => {
            console.log('Record updated successfully.');
            resolve({status: 'ok', message: 'Record updated successfully.'})
          };

          putRequest.onerror = (putEvent: Event) => {
            console.error(
              'Error updating record:',
              (putEvent.target as IDBRequest).error
            );
            reject({status: 'error', error: `Error updating record: ${(putEvent.target as IDBRequest).error}`})
          };
        } else {
          console.log(`Record with ID ${recordIdToUpdate} not found.`);
          reject({status: 'error', error: `Record with ID ${recordIdToUpdate} not found.`})
        }
      };
      getRequest.onerror = (event: Event) => {
        console.error(
          'Error getting record:',
          (event.target as IDBRequest).error
        );
      };
    });
  }
}