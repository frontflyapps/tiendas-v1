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
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../core/services/show-snackbar/show-snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AdminProductsGuard implements CanActivate, CanLoad {
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
    if (this.loggedInUserService.getLoggedInUser() && this.loggedInUserService.isAdminOrOwnerUser()) {
      return true;
    } else {
      this.route.navigate(['/error/acceso-prohibido']);
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loggedInUserService.getLoggedInUser() && this.loggedInUserService.isAdminOrOwnerUser()) {
      return true;
    } else {
      this.route.navigate(['/error/acceso-prohibido']);
      return false;
    }
  }
}
