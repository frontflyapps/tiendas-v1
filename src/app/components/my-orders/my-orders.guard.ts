import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedInUserService } from './../../core/services/loggedInUser/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class MyOrdersGuard implements CanActivate, CanLoad {
  constructor(private loggedInUserService: LoggedInUserService, private route: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loggedInUserService.getLoggedInUser()) {
      return true;
    } else {
      // this.route.navigate(['/error/acceso-prohibido']);
      let urlToRedirect = 'my-orders';
      this.route.navigate(['/my-account'], {
        queryParams: { urlToRedirect },
      });
      return false;
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loggedInUserService.getLoggedInUser()) {
      return true;
    } else {
      // this.route.navigate(['/error/acceso-prohibido']);
      let urlToRedirect = 'my-orders';
      this.route.navigate(['/my-account'], {
        queryParams: { urlToRedirect },
      });
      return false;
    }
  }
}
