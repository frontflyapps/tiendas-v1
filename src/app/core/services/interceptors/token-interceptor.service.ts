import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  token: any = null;
  currency: any = null;

  constructor(private loggedInUserService: LoggedInUserService, private translate: TranslateService) {
    this.token = loggedInUserService.getTokenCookie();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.loggedInUserService.getTokenCookie();
    const tokenBusiness: any = environment.tokenBusiness;
    const language = this.translate.currentLang;

    request = request.clone({
      withCredentials: true,
      setHeaders: {
        language: language,
      },
    });

    if (request.url.includes('v1/auth/cookies') || request.url.includes('/assets/i18n')) {
      return next.handle(request);
    }

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
