import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { IUser } from '../../classes/user.class';
import { Subject } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';
import { EncryptDecryptService } from '../encrypt-decrypt.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from '../localStorage/localStorage.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInUserService {
  $loggedInUserUpdated = new Subject<any>();
  $languageChanged = new Subject<any>();
  loggedInUser: IUser = null;
  listNavItems: any[] = [];
  visitCacheUrl = environment.apiUrl + 'addvisitcache/:token';
  public flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];

  constructor(
    private cookieService: CookieService,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService,
    private encryptDecryptService: EncryptDecryptService,
  ) {
    this.listNavItems = [...this.navigationService.getNavItems()];

    (window as any).global = window;
    // @ts-ignore
    window.Buffer = window.Buffer || require('buffer').Buffer;
    this.loggedInUser = this.getLoggedInUser();
  }

  public setNewProfile(profile) {
    let dataValue = this.getLoggedInUser() ? this.getLoggedInUser() : {};
    dataValue = Object.assign(dataValue, profile);
    this.updateUserProfile(dataValue);
    this.loggedInUser = dataValue;
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public getLanguage() {
    return JSON.parse(localStorage.getItem('language'));
  }

  public getLoggedInUser(): any {
    let user = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    try {
      user = this.encryptDecryptService.decrypt(user);
      return JSON.parse(user);
    } catch (e) {
      console.warn('Error decrypt value', e);
      this.localStorageService.actionsToClearSystem();
      return null;
    }
  }

  public setLoggedInUser(user: any) {
    this.loggedInUser = user;
  }

  public getTokenCookie(): string {
    try {
      if (this.cookieService.get('account')) {
        return this.encryptDecryptService.decrypt(this.cookieService.get('account'));
      }
      if (localStorage.getItem('token')) {
        return this.encryptDecryptService.decrypt(localStorage.getItem('token'));
      }
      return '';
    } catch (e) {
      console.warn('Error decrypt value', e);
      this.localStorageService.actionsToClearSystem();
      return null;
    }
  }

  public saveAccountCookie(token) {
    try {
      const hashedPass = this.encryptDecryptService.encrypt(token);
      this.cookieService.set('account', hashedPass, null, '/', environment.mainDomain);
      localStorage.setItem('token', hashedPass);
    } catch (e) {
      console.warn('Error decrypt value', e);
      this.localStorageService.actionsToClearSystem();
    }
  }

  public updateUserProfile(user) {
    try {
      let dataString = JSON.stringify(user);
      dataString = this.encryptDecryptService.encrypt(dataString);
      localStorage.setItem('user', dataString);
      this.$loggedInUserUpdated.next(dataString);
    } catch (e) {
      console.warn('Error decrypt value', e);
      this.localStorageService.actionsToClearSystem();
    }
  }

  removeCookies() {
    this.cookieService.delete('account', '/', environment.mainDomain);
  }

  public hasRolUser(...args: any[]) {
    let roleTypes = [...args];
    for (let type of roleTypes) {
      if (type.constructor != String) {
        return false;
      }
    }
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    let flag = false;
    if (user?.roles) {
      for (let role of user?.roles) {
        let findIndex = roleTypes.findIndex((i) => i == role.type);
        if (findIndex > -1) {
          flag = true;
          return flag;
        }
      }
    }
    return flag;
  }

  public isAdminUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    if (user?.roles) {
      user.roles.map((item) => {
        if (item.type === 'Admin') {
          flag = true;
          return true;
        }
      });
    }
    return flag;
  }

  public isOwnerUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      flag = true;
      return false;
    }
    if (user?.roles) {
      user.roles.map((item) => {
        if (item.type === 'Owner') {
          flag = true;
          return true;
        }
      });
    }
    return flag;
  }

  public isAdminOrOwnerUser() {
    const flag = this.isAdminUser() || this.isOwnerUser();
    return flag;
  }

  public isClientUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      flag = true;
      return false;
    }
    if (user?.roles) {
      user.roles.map((item) => {
        if (item.type === 'Client') {
          flag = true;
          return true;
        }
      });
    }
    return flag;
  }

  public isMessengerUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    if (user?.roles) {
      user.roles.map((item) => {
        if (item.type === 'Messenger') {
          flag = true;
          return true;
        }
      });
    }
    return flag;
  }

  public isOwnerOfABussines(OwnerId) {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    return user.id == OwnerId;
  }

  public getlaguages() {
    return this.flags;
  }

  public _getDataFromStorage(key) {
    let data = localStorage.getItem(key);
    if (data == undefined) {
      return undefined;
    }
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    let base64data = data + '';
    if (!base64regex.test(data)) {
      let buff = Buffer.from(data);
      base64data = buff.toString('base64');
      localStorage.setItem(key, base64data);
    }
    let buff2 = Buffer.from(base64data, 'base64');
    let userLogged = buff2.toString('utf-8');
    return JSON.parse(userLogged);
  }

  public _setDataToStorage(key, stringData) {
    let buff = Buffer.from(stringData);
    let base64data = buff.toString('base64');
    localStorage.setItem(key, base64data);
  }
}
