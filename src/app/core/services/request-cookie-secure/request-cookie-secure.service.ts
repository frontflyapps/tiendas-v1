import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestCookieSecureService {
  url = environment.apiUrl + 'auth/cookies';

  httpOptions: any;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {};
  }

  rq(): Observable<any> {
    return this.httpClient.get<any>(this.url, this.httpOptions);
  }

  public requestCookiesSecure() {
    this.rq().subscribe(
      (res: any) =>
        console.warn('Cookies Requested Success'),
      (error: any) => {
        console.warn('Cookies Requested Error');
      });
  }
}
