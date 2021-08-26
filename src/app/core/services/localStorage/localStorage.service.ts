import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

export const ReLoggedTime = environment.timeToResetSession; // Time in (ms), Time to reload data and clear localStorage
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
    const evaluateVersion = (v?.version !== environment.versions.app);
    if (!v || !v?.version || !v?.timespan || evaluateVersion) {
      this.diffTimeSpan(v);
      this.actionsToClearSystem();
      this.setVersionOnLocalStorage();
      return false;
    }
    this.diffTimeSpan(v);
    this.setVersionOnLocalStorage();
  }

  diffTimeSpan(v) {
    const timeNow = new Date().getTime();
    const nowTimeSpan = timeNow - (v?.timespan || 0);
    if (nowTimeSpan > ReLoggedTime && ReLoggedTime !== 0) {
      this.actionsToClearSystem();
      this.setVersionOnLocalStorage();
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
