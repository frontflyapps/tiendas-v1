import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class GlobalStateOfCookieService {

  stateOfCookie: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  stateOfCookie$: Observable<boolean> = this.stateOfCookie.asObservable();

  getCookieState() {
    return this.stateOfCookie?.value || false;
  }
}
