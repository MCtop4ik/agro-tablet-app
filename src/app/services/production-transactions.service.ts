import { Injectable } from '@angular/core';
import { DBService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class RigTicketsService {

  constructor(
    private db: DBService
  ) { }

  async get_production_transactions() {
    let production_transactions = await this.db.getAll('production_transactions')
    return Object.values(production_transactions);
  }

  async save_in_production_transactions(new_production_transaction: any) {
    if (new_production_transaction == undefined) {
      return
    }
    console.log(new_production_transaction);

    let update_production_transaction = false;
    if (this.is_created(new_production_transaction)){
      new_production_transaction.Record_PK = this.generateRandomRecordPK();
    }

    try {
      const data = await this.db.getAll('production_transactions');
      let production_transactions = data[0] || [];
      if (this.is_production_transactions_exists(production_transactions)) {
        for (let production_transaction_index = 0; production_transaction_index < production_transactions.length; production_transaction_index++) {
          const production_transaction = production_transactions[production_transaction_index];
          if (production_transaction.Record_PK === new_production_transaction.Record_PK) {
            this.save_in_updated_production_transactions(new_production_transaction);
            production_transactions[production_transaction_index] = new_production_transaction;

            update_production_transaction = true;
            break;
          }
        }

        if (!update_production_transaction) {
          this.save_in_created_production_transactions(new_production_transaction);
          production_transactions.push(new_production_transaction);
          update_production_transaction = true;
        }
      } else {
        production_transactions = [new_production_transaction];
        this.save_in_created_production_transactions(new_production_transaction);
      }

      this.save_all_production_transactions(production_transactions);
    } catch (error) {
      console.error('Error retrieving rig tickets:', error);
    }
  }

  private is_created(new_production_transaction: any) {
    return !(Object.keys(new_production_transaction).includes('Record_PK'))
  }

  private is_production_transactions_exists(production_transactions: any) {
    return production_transactions.length > 0
  }

  save_all_production_transactions(production_transactions: any) {
    this.db.clearStorage('production_transactions');
    this.db.addData('production_transactions', production_transactions);
  }

  private save_in_created_production_transactions(production_transaction: any) {
    this.db.addData('created_production_transactions', production_transaction);
  }

  private save_in_updated_production_transactions(production_transaction: any) {
    this.db.addData('updated_production_transactions', production_transaction);
  } 

  private generateRandomRecordPK(length: number = 8): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  clearDatabase() {
    this.db.clearStorage('production_transactions');
  }


}
