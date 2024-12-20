import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { DBService } from './database.service';

@Injectable({
    providedIn: 'root'
})
export class SynchroniseService {

    constructor(private httpService: HttpService,
        private database: DBService
    ) { }

    async synchronise() {
        const create_production_transactions = await this.database.getAll('created_production_transactions');
        const update_production_transactions = await this.database.getAll('updated_production_transactions');

        const insert_data = {
            'create_production_transactions': create_production_transactions,
            'update_production_transactions': update_production_transactions
        }

        this.httpService.synchronise({'synchronisation_data': insert_data}).subscribe(() => {
            this.database.clearStorage('created_production_transactions').then(() => {console.log('Successfully cleared created rig tickets storage!')});
            this.database.clearStorage('updated_production_transactions').then(() => {console.log('Successfully cleared updated rig tickets storage!')});
        })
    }
}
