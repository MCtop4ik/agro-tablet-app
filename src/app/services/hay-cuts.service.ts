import { Injectable } from '@angular/core';
import { DBService } from './database.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class HayCutsService {

    constructor(private httpService: HttpService,
        private dbService: DBService
    ) {

    }

    load_hay_cuts() {
        this.httpService.get_hay_cuts().subscribe((hay_cuts) => {
            this.save_hay_cuts(hay_cuts);
        })
    }

    private save_hay_cuts(hay_cuts: any) {
        this.dbService.clearStorage('hay_cuts')
        this.dbService.addData('hay_cuts', hay_cuts);
    }

    private find_hay_cut_by_keyword_ck(keyword_ck: string, hay_cuts: any[]): any {
        if (keyword_ck == undefined || hay_cuts == undefined) {
            return undefined;
        }
        return hay_cuts.find(hay_cut => hay_cut.Keyword_CK=== keyword_ck);
    }

    get_hay_cut_description(keyword_ck: string, hay_cuts: any[]) {
        let hay_cut = this.find_hay_cut_by_keyword_ck(keyword_ck, hay_cuts);
        if (hay_cut == undefined){
          return 'No'
        }
        return hay_cut.Description;
    }
}