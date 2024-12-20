import { Injectable } from '@angular/core';
import { DBService } from './database.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class HayTypesService {

    constructor(private httpService: HttpService,
        private dbService: DBService
    ) {

    }

    load_hay_types() {
        this.httpService.get_hay_types().subscribe((hay_types) => {
            this.save_hay_types(hay_types);
        })
    }

    private save_hay_types(hay_types: any) {
        this.dbService.clearStorage('hay_types')
        this.dbService.addData('hay_types', hay_types);
    }

    private find_hay_type_by_keyword_ck(keyword_ck: string, hay_types: any[]): any {
        if (keyword_ck == undefined || hay_types == undefined) {
            return undefined;
        }
        return hay_types.find(hay_type => hay_type.Keyword_CK === keyword_ck);
    }

    get_hay_type_description(keyword_ck: string, hay_types: any[]) {
        let hay_type = this.find_hay_type_by_keyword_ck(keyword_ck, hay_types);
        if (hay_type == undefined){
          return 'No'
        }
        return hay_type.Description;
    }
}