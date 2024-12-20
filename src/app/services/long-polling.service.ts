import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LongPollingService {
  constructor(private http: HttpClient) {}

  poll(url: string): Observable<any> {
    return new Observable<any>((observer) => {
      const pollInterval = setInterval(() => {
        this.http.get(url).subscribe((response) => {
          observer.next(response);
        });
      }, 60 * 1000);

      return () => clearInterval(pollInterval);
    });
  }
}