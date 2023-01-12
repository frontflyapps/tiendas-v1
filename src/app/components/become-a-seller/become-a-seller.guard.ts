import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedInUserService } from './../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from './../../core/services/show-snackbar/show-snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class BecomeASellerGuard implements CanActivate, CanLoad {
  constructor(
    private loggedInUserService: LoggedInUserService,
    private translateService: TranslateService,
    private route: Router,
    private showSnackBar: ShowSnackbarService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loggedInUserService.getLoggedInUser()) {
      return true;
    } else {
      localStorage.setItem('isRegisterToBecomeASeller', 'true');
      this.showSnackBar.showSucces(
        this.translateService.instant('Debe iniciar sesión para entrar en la creación de cuenta de vendedor'),
        8000,
      );
      this.route.navigate(['/my-account']);
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.loggedInUserService.getLoggedInUser());
    if (this.loggedInUserService.getLoggedInUser()) {
      console.log('entra aqui');
      return true;
    } else {
      localStorage.setItem('isRegisterToBecomeASeller', 'true');
      this.showSnackBar.showSucces(
        this.translateService.instant('Debe iniciar sesión para entrar en la creación de cuenta de vendedor'),
        8000,
      );
      this.route.navigate(['/my-account']);
      return false;
    }
  }
}
