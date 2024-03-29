import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { GlobalStateOfCookieService } from './global-state-of-cookie.service';

@Injectable({
  providedIn: 'root',
})
export class RequestCookieSecureService {
  url = environment.apiUrl + 'auth/cookies';

  httpOptions: any;

  unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient, private globalStateOfCookieService: GlobalStateOfCookieService) {
    this.httpOptions = {};
  }

  rq(): Promise<any> {
    return this.httpClient.get<any>(this.url, this.httpOptions).toPromise();
  }

  public async requestCookiesSecure() {
    await this.rq()
      .then(() => {
        this.globalStateOfCookieService.stateOfCookie.next(true);
      })
      .catch(function (error) {
        console.error('Cookies Requested Error', error);
      });
  }

  clearUnsubscribeAll() {
    setTimeout(() => {
      if (this.unsubscribeAll) {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
      }
    }, 0);
  }
}
