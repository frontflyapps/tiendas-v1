import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  urlCookie = environment.apiUrl + 'auth/cookies';
  urlBusinessConfig = environment.apiUrl + 'business-config';
  urlBusinessConfigId = environment.apiUrl + 'business-config/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  requestCookie(): Observable<any> {
    return this.httpClient.get<any>(this.urlCookie);
  }

  getBusinessConfig(): Observable<any> {
    return this.httpClient.get<any>(this.urlBusinessConfig);
  }
  getBusinessConfigId(data): Observable<any> {
    return this.httpClient.get<any>(this.urlBusinessConfigId.replace(':id', data), this.httpOptions);
  }
}
