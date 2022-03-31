import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Cart, CartItem } from 'src/app/modals/cart-item';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { GlobalFacadeService } from '../../../facades/services/global-facade.service';
import { ConfiguracionService } from '../../../core/services/config/configuracion.service';

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

  private dataTimeKeyName = 'cartLifeTime';

  constructor(
    public cartService: CartService,
    public configService: ConfiguracionService,
    public productService: ProductService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    private globalFacadeService: GlobalFacadeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.shoppingCarts = data;
      this.shoppingCartItems = this.cartService.getShoppingCars();

      if (Array.isArray(data) && data.length > 0 && this.loggedInUser) {
        this.cartService.dateCreatedAtCart = data[0].createdAt;

        this.cartService.setCartInPaying(data[0].status);

        this.getCartTime();
      }

      if (Array.isArray(data) && data.length == 0) {
        this.cartService.dateCreatedAtCart = '';
        this.cartService.cartExpiredTime = '';
        this.cartService.setCartInPaying(false);
      }
    });

    this.cartService.$paymentUpdate.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.fillShoppingCart();
    });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      this.fillShoppingCart();
    });

    if (this.loggedInUser) {
      this.cartService.getCart().then((data) => {
        this.shoppingCarts = data.data;

        if (Array.isArray(data.data) && data.data.length > 0) {
          this.cartService.dateCreatedAtCart = data.data[0].createdAt;

          this.cartService.setCartInPaying(data.data[0].status);

          this.getCartTime();
        }

        this.globalFacadeService.updateCartState(data.data || []);
        this.globalFacadeService.updateBusinessState(data.data[0]?.Business || {});
        this.shoppingCartItems = this.cartService.getShoppingCars();
      });
    } else {
      this.shoppingCarts = this.cartService.getCartNoLogged();
      this.globalFacadeService.updateCartState(this.shoppingCarts || []);
      this.globalFacadeService.updateBusinessState(this.shoppingCarts[0]?.Business || {});
      this.shoppingCartItems = this.cartService.getShoppingCars();
    }
  }

  getCartTime() {
    this.configService.getValue(this.dataTimeKeyName)
      .then((dataRes) => {
        this.cartService.cartDurationTime = dataRes.time;
        this.cartService.calcExpiredTime(this.cartService.dateCreatedAtCart, this.cartService.cartDurationTime);
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public trackBusinessFn(index: number, business: any): number {
    return business.BusinessId;
  }

  public trackStockFn(index: number, stock: any): number {
    return stock.StockId;
  }

  public removeItem(item: any) {
    this.cartService.removeFromCart(item).then(
      responseData => {
        // this.globalFacadeService.updateCartState(responseData || []);
        // this.globalFacadeService.updateBusinessState(responseData[0].Business || {});
      },
    );
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

  private fillShoppingCart() {
    if (this.loggedInUser) {
      this.cartService.getCart().then((data) => {
        this.shoppingCarts = data.data;
        this.globalFacadeService.updateCartState(data.data || []);
        this.globalFacadeService.updateBusinessState(data.data[0]?.Business || {});
        this.shoppingCartItems = this.cartService.getShoppingCars();
      });
    } else {
      this.shoppingCarts = [];
      this.globalFacadeService.updateCartState(this.shoppingCarts || []);
      this.globalFacadeService.updateBusinessState(this.shoppingCarts[0]?.Business || {});
      this.shoppingCartItems = this.cartService.getShoppingCars();
    }
  }
}
