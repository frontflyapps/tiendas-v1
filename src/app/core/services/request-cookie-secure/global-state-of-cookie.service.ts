import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class GlobalStateOfCookieService {

  stateOfCookie: BehaviorSubject<boolean>;
  stateOfCookie$: Observable<boolean>;

  constructor() {
    this.stateOfCookie = new BehaviorSubject<boolean>(false);
    this.stateOfCookie$ = this.stateOfCookie.asObservable();

    console.log('ya service');
  }

  getCookieState() {
    return this.stateOfCookie.value || false;
  }
}
