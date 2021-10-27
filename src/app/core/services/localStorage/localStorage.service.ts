import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

export const ReLoggedTime = environment.timeToResetSession; // Time in (ms), Time to reload data and clear localStorage
export interface IVersionSystem {
  version: string;
  timespan: number;
}

export const SESSION_STORAGE_KEY = '_ldInit';

export interface ISessionStorageItems {
  landingPage?: boolean;
  search?: boolean;
  profile?: false;
  cart?: false;
  checkout?: false;
  timespan: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  static initStateSession(): ISessionStorageItems {
    const today = new Date().getTime();
    return {
      landingPage: false,
      search: false,
      profile: false,
      cart: false,
      checkout: false,
      timespan: today,
    };
  }

  constructor(
    private cookieService: CookieService,
  ) {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(LocalStorageService.initStateSession()));
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

  setOnStorage(key: string, data: any) {
    if (data && key) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  getFromStorage(key: string): any {
    if (key) {
      const dataStorage = JSON.parse(localStorage.getItem(key));
      return dataStorage || null;
    }
    return null;
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  removeCookies() {
    this.cookieService.delete('account', '/', environment.mainDomain);
  }

  iMostReSearch(timeData, timeDiffENV) {
    const timeNow = new Date().getTime();

    if (!timeData || !timeDiffENV) {
      return true;
    }

    return (timeNow - timeData) >= timeDiffENV;
  }
}
