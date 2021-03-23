import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  token: any = null;
  currency: any = null;
  language: any = null;

  constructor(private loggedInUserService: LoggedInUserService) {
    this.token = loggedInUserService.getTokenCookie();
    this.currency = JSON.parse(localStorage.getItem('currency'))
      ? JSON.parse(localStorage.getItem('currency')).name
      : null;
    this.language = JSON.parse(localStorage.getItem('language'))
      ? JSON.parse(localStorage.getItem('language')).lang
      : null;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.loggedInUserService.getTokenCookie();
    const tokenBusiness: any = environment.tokenBusiness;

    this.currency = JSON.parse(localStorage.getItem('currency'))
      ? JSON.parse(localStorage.getItem('currency')).name
      : null;
    this.language = JSON.parse(localStorage.getItem('language'))
      ? JSON.parse(localStorage.getItem('language')).lang
      : null;

    // console.log("TokenInterceptorService -> request.headers.get('noToken')", request.headers.get('noNewToken'));
    // console.log('TokenInterceptorService -> request.headers', request);
    // request.headers.get('noNewToken') == undefined
    if (tokenBusiness) {
      request = request.clone({
        setHeaders: {
          ['xxx-ff-id']: tokenBusiness,
        },
      });
    }
    if (this.token && !request.url.includes('auth/login')) {
      request = request.clone({
        setHeaders: {
          Authorization: this.token,
        },
      });
    }
    if (this.language) {
      request = request.clone({
        setHeaders: {
          language: this.language,
        },
      });
    }
    if (this.currency) {
      request = request.clone({
        setHeaders: {
          currency: this.currency,
        },
      });
    }
    return next.handle(request);
  }
}
