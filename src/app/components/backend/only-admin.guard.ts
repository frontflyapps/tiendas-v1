import { LoggedInUserService } from './../../core/services/loggedInUser/logged-in-user.service';
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

@Injectable({
  providedIn: 'root',
})
export class OnlyAdminGuard implements CanActivate, CanLoad {
  constructor(private loggedInUserService: LoggedInUserService, private route: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loggedInUserService.getLoggedInUser() && this.loggedInUserService.isAdminUser()) {
      return true;
    } else {
      this.route.navigate(['/error/acceso-prohibido']);
      return false;
    }
  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loggedInUserService.getLoggedInUser() && this.loggedInUserService.isAdminUser()) {
      return true;
    } else {
      this.route.navigate(['/error/acceso-prohibido']);
      return false;
    }
  }
}
