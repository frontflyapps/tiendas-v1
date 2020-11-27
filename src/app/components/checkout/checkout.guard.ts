import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  UrlSegment,
  Router,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedInUserService } from './../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from './../../core/services/show-snackbar/show-snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate, CanLoad {
  constructor(
    private loggedInUserService: LoggedInUserService,
    private translateService: TranslateService,
    private route: Router,
    private showSnackBar: ShowSnackbarService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loggedInUserService.getLoggedInUser()) {
      return true;
    } else {
      localStorage.setItem('isRegisterToPay', 'true');
      this.showSnackBar.showSucces(
        this.translateService.instant('You need to be logged in to pay, please register or create an account'),
        8000,
      );
      this.route.navigate(['/my-account']);
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loggedInUserService.getLoggedInUser()) {
      return true;
    } else {
      localStorage.setItem('isRegisterToPay', 'true');
      this.showSnackBar.showSucces(
        this.translateService.instant('You need to be logged in to pay, please register or create an account'),
        8000,
      );
      this.route.navigate(['/my-account']);
      return false;
    }
  }
}
