import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CartItem, Cart } from './../../../modals/cart-item';
import { CurrencyService } from './../../../core/services/currency/currency.service';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../shared/services/cart.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ProductService } from '../../shared/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  public shoppingCartItems: CartItem[] = [];
  public carts: Cart[] = [];
  inLoading: boolean = false;
  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;
  loggedInUser: any = null;

  constructor(
    private cartService: CartService,
    public currencyService: CurrencyService,
    public productsService: ProductService,
    public loggedInUserService: LoggedInUserService,
    public utilsServ: UtilsService,
    private router: Router,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this.cartService.getCart().then((data) => {
          this.carts = data.data;
        });
      }
    });

    if (this.loggedInUser) {
      this.cartService.getCart().then((data) => {
        this.carts = data.data;
      });
    } else {
      this.carts = [...this.cartService.getCartNoLogged()];
    }

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((_carts) => {
      console.log('CartComponent -> ngOnInit -> _carts', _carts);
      this.carts = [..._carts];
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // Remove cart items
  public removeItem(item: CartItem) {
    this.inLoading = true;
    this.cartService
      .removeFromCart(item)
      .then((data) => {
        this.inLoading = false;
      })
      .catch((error) => {
        this.inLoading = false;
      });
  }

  // Increase Product Quantity
  public increment(product: any, quantity: number = 1) {
    this.inLoading = true;
    this.cartService
      .addToCart(product, quantity)
      .then((data) => {
        this.inLoading = false;
      })
      .catch((error) => {
        this.inLoading = false;
      });
  }

  // Decrease Product Quantity
  public decrement(product: any, quantity: number = -1) {
    this.cartService
      .addToCart(product, quantity)
      .then((data) => {
        this.inLoading = false;
      })
      .catch((error) => {
        this.inLoading = false;
      });
  }
  // Get Total
  public getTotal(cart?): any {
    return this.cartService.getTotalAmount(cart);
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
