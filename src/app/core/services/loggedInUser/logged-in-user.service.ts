import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { IUser } from '../../classes/user.class';
import { Subject } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';

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

  constructor(private navigationService: NavigationService, private httpClient: HttpClient) {
    this.listNavItems = [...this.navigationService.getNavItems()];

    (window as any).global = window;
    // @ts-ignore
    window.Buffer = window.Buffer || require('buffer').Buffer;
    this.loggedInUser = this._getDataFromStorage('user');
  }

  public setNewProfile(profile) {
    let dataValue = this._getDataFromStorage('user') ? this._getDataFromStorage('user') : {};
    dataValue.profile = Object.assign(dataValue.profile, profile);
    this._setDataToStorage('user', JSON.stringify(dataValue));
    this.loggedInUser = dataValue;
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public getLanguage() {
    return JSON.parse(localStorage.getItem('language'));
  }

  public getLoggedInUser(): any {
    let data = this._getDataFromStorage('user');
    data = data ? data.profile : null;
    return data;
  }
  public getTokenOfUser(): any {
    let data = this._getDataFromStorage('user');
    data = data ? data.Authorization : null;
    return data;
  }

  public setLoggedInUser(user: any) {
    this.loggedInUser = user;
  }

  public updateUserProfile(user) {
    let dataString: string;
    let dataUser = this._getDataFromStorage('user');
    const tempdata = dataUser ? dataUser : {};
    if (user) {
      this.loggedInUser = Object.assign(tempdata, user);
    } else {
      this.loggedInUser = null;
    }
    dataString = JSON.stringify(this.loggedInUser);
    this._setDataToStorage('user', dataString);
    this.$loggedInUserUpdated.next(this.loggedInUser);
  }

  public isAdminUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    user.roles.map((item) => {
      if (item.type === 'Admin') {
        flag = true;
        return true;
      }
    });
    return flag;
  }
  public isOwnerUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      flag = true;
      return false;
    }
    user.roles.map((item) => {
      if (item.type === 'Owner') {
        flag = true;
        return true;
      }
    });
    return flag;
  }

  public isAdminOrOwnerUser() {
    const flag = this.isAdminUser() || this.isOwnerUser();
    // console.log('LoggedInUserService -> isAdminOrOwnerUser -> flag', flag);
    return flag;
  }

  public isClientUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      flag = true;
      return false;
    }
    user.roles.map((item) => {
      if (item.type === 'Client') {
        flag = true;
        return true;
      }
    });
    return flag;
  }

  public isMessengerUser() {
    let flag = false;
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    user.roles.map((item) => {
      if (item.type === 'Messenger') {
        flag = true;
        return true;
      }
    });
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

// res.status(httpStatus).json({
//   errors: [
//     {
//       field: 'example ',
//       message: 'example messaje',
//     },
//   ],
// });
