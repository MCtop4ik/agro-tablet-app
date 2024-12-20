import { Injectable } from '@angular/core';
import { DBService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private db: DBService) {}

  async loadData(tableName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.getAll(tableName)?.then((data: any) => {
        resolve(data[0]);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  extractDate(dateTimeString: string): string {
    const [date] = dateTimeString.split('T');
    return date;
  }
}