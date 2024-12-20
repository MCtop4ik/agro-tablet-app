import { Injectable } from '@angular/core';
import { DBService } from './database.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class FarmsService {

    constructor(private httpService: HttpService,
        private dbService: DBService
    ) {

    }

    load_farms() {
        this.httpService.get_farms().subscribe((farms) => {
            this.save_farms(farms)
        })
    }

    private save_farms(farms: any) {
        this.dbService.clearStorage('farms')
        this.dbService.addData('farms', farms)
    }

    private find_farm_by_recordpk(record_pk: string, farms: any[]): any {
        if (record_pk == undefined || farms == undefined) {
            return undefined;
        }
        return farms.find(farm => farm.Record_PK === record_pk);
    }

    get_farm_name(record_pk: string, farms: any[]) {
        let farm = this.find_farm_by_recordpk(record_pk, farms);
        console.log('farms', farms);
        console.log(farm);
        if (farm == undefined){
          return 'No'
        }
        return farm.Farm_Name;
    }
}