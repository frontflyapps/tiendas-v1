import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from './../../../core/services/currency/currency.service';
import { environment } from './../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Cart, CartItem } from 'src/app/modals/cart-item';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-shopping-widgets',
  templateUrl: './shopping-widgets.component.html',
  styleUrls: ['./shopping-widgets.component.scss'],
})
export class ShoppingWidgetsComponent implements OnInit, OnDestroy {
  products: any[];
  indexProduct: number;
  cartLocalStorage: any;
  public sidenavMenuItems: Array<any>;

  shoppingCarts: Cart[] = [];
  shoppingCartItems: CartItem[] = [];

  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;
  loggedInUser: any;

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    private router: Router,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this.cartService.getCart().then((data) => {
          this.shoppingCarts = data.data;
          this.shoppingCartItems = this.cartService.getShoppingCars();
        });
      } else {
        this.shoppingCarts = [];
        this.shoppingCartItems = this.cartService.getShoppingCars();
      }
    });

    if (this.loggedInUser) {
      this.cartService.getCart().then((data) => {
        this.shoppingCarts = data.data;
        this.shoppingCartItems = this.cartService.getShoppingCars();
      });
    } else {
      this.shoppingCarts = this.cartService.getCartNoLogged();
      this.shoppingCartItems = this.cartService.getShoppingCars();
    }

    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.shoppingCarts = data;
      this.shoppingCartItems = this.cartService.getShoppingCars();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public removeItem(item: any) {
    this.cartService.removeFromCart(item);
  }

  public getTotal(cart): any {
    return this.cartService.getTotalAmount(cart);
  }

  public getTotalFull() {
    return this.cartService.getFullTotalAmount();
  }

  public getTotalPricePerItem(item: CartItem) {
    let price = this.cartService.getPriceofProduct(item.Product, item.quantity);
    return price * item.quantity;
  }

  public goToCheckout(cart: Cart, cartITems?) {
    let cartId = cart.id;
    let cartIds = cartITems ? cartITems.map((i) => i.id) : cart.CartItems.map((i) => i.id);
    this.router.navigate(['/checkout'], { queryParams: { cartId, cartIds } });
  }
}
