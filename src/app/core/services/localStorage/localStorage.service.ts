import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

export interface IVersionSystem {
  version: string;
  timespan: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(
    private cookieService: CookieService,
  ) {
  }

  setVersion() {
    const v: IVersionSystem = JSON.parse(localStorage.getItem('_v'));
    console.log('v', v?.version || 'No version');
    console.log('v env', environment.versions.app);
    if (!v || !v?.version || !v?.timespan || (v?.version !== environment.versions.app)) {
      this.actionsToClearSystem();
      this.setVersionOnLocalStorage();
      return false;
    }
  }

  actionsToClearSystem() {
    this.clearLocalStorage();
    this.removeCookies();
  }

  setVersionOnLocalStorage() {
    const v: IVersionSystem = {
      version: environment.versions.app,
      timespan: new Date().getTime(),
    };
    localStorage.setItem('_v', JSON.stringify(v));
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  removeCookies() {
    this.cookieService.delete('account', '/', environment.mainDomain);
  }
}
