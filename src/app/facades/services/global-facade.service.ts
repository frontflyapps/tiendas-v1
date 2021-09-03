import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FacadeStateModel } from '../models/facade.model';
import { Cart, IBusiness } from '../../modals/cart-item';

@Injectable({
  providedIn: 'root',
})
export class GlobalFacadeService {
  private state = new FacadeStateModel();
  private dispatch = new BehaviorSubject<FacadeStateModel>(this.state);

  cartState$: Observable<Cart[]> = this.dispatch.asObservable().pipe(
    map(state => state.Carts),
  );

  businessState$: Observable<IBusiness> = this.dispatch.asObservable().pipe(
    map(state => state.Business),
  );

  updateCartState(cart: Cart[]) {
    this.dispatch.next(
      (this.state = {
        ...this.state,
        Carts: cart,
      }),
    );
  }

  updateBusinessState(business: IBusiness) {
    this.dispatch.next(
      (this.state = {
        ...this.state,
        Business: business,
      }),
    );
  }
}
