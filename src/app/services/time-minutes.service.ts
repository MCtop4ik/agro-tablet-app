import { Injectable } from '@angular/core';
import { DBService } from './database.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class TimeMinutesService {

    constructor(private httpService: HttpService,
        private dbService: DBService
    ) {

    }

    load_time_minutes() {
        this.httpService.get_time_minutes().subscribe((time_minutes) => {
            this.save_time_minutes(time_minutes)
        })
    }

    private save_time_minutes(time_minutes: any) {
        this.dbService.clearStorage('time_minutes')
        this.dbService.addData('time_minutes', time_minutes)
    }

    private find_time_minute_by_keyword_ck(keyword_ck: string, time_minutes: any[]): any {
        if (keyword_ck == undefined || time_minutes == undefined) {
            return undefined;
        }
        return time_minutes.find(time_minute => time_minute.Keyword_CK === keyword_ck);
    }

    get_time_minute_description(keyword_ck: string, time_minutes: any[]) {
        let time_minute = this.find_time_minute_by_keyword_ck(keyword_ck, time_minutes);
        if (time_minute == undefined){
          return 'No'
        }
        return time_minute.Description;
    }
}