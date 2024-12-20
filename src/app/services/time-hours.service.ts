import { Injectable } from '@angular/core';
import { DBService } from './database.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class TimeHoursService {

    constructor(private httpService: HttpService,
        private dbService: DBService
    ) {

    }

    load_time_hours() {
        this.httpService.get_time_hours().subscribe((time_hours) => {
            this.save_time_hours(time_hours)
        })
    }

    private save_time_hours(time_hours: any) {
        this.dbService.clearStorage('time_hours')
        this.dbService.addData('time_hours', time_hours)
    }

    private find_time_hour_by_keyword_ck(keyword_ck: string, time_hours: any[]): any {
        if (keyword_ck == undefined || time_hours == undefined) {
            return undefined;
        }
        return time_hours.find(time_hour => time_hour.Keyword_CK === keyword_ck);
    }

    get_time_hour_description(keyword_ck: string, time_hours: any[]) {
        let time_hour = this.find_time_hour_by_keyword_ck(keyword_ck, time_hours);
        if (time_hour == undefined){
          return 'No'
        }
        return time_hour.Description;
    }
}