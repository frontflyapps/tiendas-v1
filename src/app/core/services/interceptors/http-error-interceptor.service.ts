import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilsService } from '../utils/utils.service';
import { ShowSnackbarService } from '../show-snackbar/show-snackbar.service';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {
  url = '';

  constructor(
    private utilsService: UtilsService,
    private showSnackbar: ShowSnackbarService,
    private loggedInUserService: LoggedInUserService,
    private translate: TranslateService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error del lado del cliente: ${error.error.message}`;
          this.showSnackbar.showError(errorMessage, 'Error');
        } else {
          errorMessage = error.error;
          this.processingBackendError(error);
        }
        return throwError(error);
      }),
    );
  }

  // /////////////////////Procesing Error////////////////////////////////
  processingBackendError(err) {
    if (err.status == 401) {
      this.utilsService.errorHandle(err);
      if (this.router.url.includes('my-account')) {
      } else {
        localStorage.removeItem('user');
        this.loggedInUserService.setLoggedInUser(null);
        this.loggedInUserService.removeCookies();
        this.loggedInUserService.$loggedInUserUpdated.next(null);
        this.utilsService.errorHandle(err);
        this.router.navigate(['my-account']);
      }
    } else if (err.status == 403) {
      if (this.router.url.includes('backend')) {
        localStorage.removeItem('user');
        this.router.navigate(['my-account']);
      }
      this.utilsService.errorHandle(err);
    } else if (err.status == 404) {
      this.utilsService.errorHandle(err);
      // this.router.navigate(['/error/404']);
    } else if (err.status == 400 || err.status == 500) {
      this.utilsService.errorHandle(err);
    } else if (err.status == 0) {
      // this.router.navigate(['/error/conexion-perdida']);
      this.showSnackbar.showError(
        this.translate.instant(
          `Server response failed, check your connection to the network, or contact the administrators`,
        ),
      );
    }
  }

  ///////////////////////////////////////////////////////
}
