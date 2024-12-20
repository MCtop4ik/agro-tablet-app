import { Injectable } from '@angular/core';
import { DBService } from './database.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class FieldsService {

    constructor(private httpService: HttpService,
        private dbService: DBService
    ) {

    }

    load_fields() {
        this.httpService.get_fields().subscribe((fields) => {
            this.save_fields(fields);
        })
    }

    private save_fields(fields: any) {
        this.dbService.clearStorage('fields')
        this.dbService.addData('fields', fields);
    }

    private find_field_by_record_pk(record_pk: string, fields: any[]): any {
        if (record_pk == undefined || fields == undefined) {
            return undefined;
        }
        return fields.find(field => field.Record_PK === record_pk);
    }

    get_field_id(record_pk: string, fields: any[]) {
        let field = this.find_field_by_record_pk(record_pk, fields);
        if (field == undefined){
          return 'No'
        }
        return field.Field_ID;
    }
}