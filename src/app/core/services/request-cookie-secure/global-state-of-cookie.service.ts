import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class GlobalStateOfCookieService {

  stateOfCookie: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  stateOfCookie$ = this.stateOfCookie.asObservable();

  getCookieState() {
    return this.stateOfCookie.value;
  }
}
