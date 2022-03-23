import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { GlobalStateOfCookieService } from './global-state-of-cookie.service';

@Injectable({
  providedIn: 'root',
})
export class RequestCookieSecureService {
  url = environment.apiUrl + 'auth/cookies';

  httpOptions: any;

  unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient,
              private globalStateOfCookieService: GlobalStateOfCookieService) {
    this.httpOptions = {};
  }

  rq(): Observable<any> {
    return this.httpClient.get<any>(this.url, this.httpOptions);
  }

  public requestCookiesSecure() {
    this.rq()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: any) => {
          console.warn('Cookies Requested Success');

          this.globalStateOfCookieService.stateOfCookie.next(true);

          this.clearUnsubscribeAll();
        },
        (error: any) => {
          console.warn('Cookies Requested Error');

          this.globalStateOfCookieService.stateOfCookie.next(false);

          this.clearUnsubscribeAll();
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
