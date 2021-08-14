import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
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
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.loggedInUserService.getTokenCookie();
    console.log('INTT', this.token);
    const tokenBusiness: any = environment.tokenBusiness;

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
    return next.handle(request);
  }
}
