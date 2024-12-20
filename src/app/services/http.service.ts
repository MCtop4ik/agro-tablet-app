import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getAuthHeader(): Observable<HttpHeaders> {
    return from(this.authService.get_token()).pipe(
      map((token) => {
        return new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        });
      })
    );
  }

  authentification(data: any): any {
    return this.http.post(`${this.baseUrl}/v1/authentification/login`, data, {
      observe: 'response',
      headers: this.getHeader().headers,
    });
  }

  get_farms(): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.get(`${this.baseUrl}/v1/farms`, { headers: headers });
      })
    );
  }

  get_fields(): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.get(`${this.baseUrl}/v1/fields`, { headers: headers });
      })
    );
  }

  get_hay_types(): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.get(`${this.baseUrl}/v1/hay-types`, { headers: headers });
      })
    );
  }

  get_hay_cuts(): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.get(`${this.baseUrl}/v1/hay-cuts`, { headers: headers });
      })
    );
  }

  get_time_minutes(): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.get(`${this.baseUrl}/v1/time-minutes`, { headers: headers });
      })
    );
  }

  get_time_hours(): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.get(`${this.baseUrl}/v1/time-hours`, { headers: headers });
      })
    );
  }


  getHeader() {
    const http_options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return http_options;
  }

  editProfileInfo(data: any): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.put(
          `${this.baseUrl}/v1/authentification/change_profile_info`,
          data,
          {
            observe: 'response',
            headers: headers,
          }
        );
      })
    );
  }

  synchronise(data: any): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        console.log(headers);
        return this.http.post(`${this.baseUrl}/v1/synchronisation`, data, {
          observe: 'response',
          headers: headers,
        });
      })
    );
  }


  changePassword(insert_data: any): Observable<any> {
    return this.getAuthHeader().pipe(
      switchMap((headers) => {
        return this.http.put(`${this.baseUrl}/v1/change_password`, insert_data, {
          observe: 'response',
          headers: headers,
        });
      })
    );
  }
}
