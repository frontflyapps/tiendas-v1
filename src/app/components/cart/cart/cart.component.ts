import { MetaService } from 'src/app/core/services/meta.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem, Cart } from '../../../modals/cart-item';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../shared/services/cart.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ProductService } from '../../shared/services/product.service';
import { Router } from '@angular/router';
import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  public shoppingCartItems: CartItem[] = [];
  public carts: Cart[] = [];
  inLoading = false;
  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;
  loggedInUser: any = null;

  public itemsOnCart = 0;

  constructor(
    public cartService: CartService,
    public currencyService: CurrencyService,
    public utilsService: UtilsService,
    public loggedInUserService: LoggedInUserService,
    public utilsServ: UtilsService,
    private router: Router,
    private metaService: MetaService,
    private showToastr: ShowToastrService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.metaService.setMeta(
      'Carrito de compras',
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this.cartService.getCart().then((dataCart: any) => {
          this.carts = dataCart.data;
        });
      }
    });

    if (this.loggedInUser) {
      this.cartService.getCart().then((dataCart: any) => {
        this.carts = dataCart.data;
      });
    } else {
      this.carts = [...this.cartService.getCartNoLogged()];
    }

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((_carts) => {
      this.carts = [..._carts];
    });

    this.subsCartChange();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  subsCartChange() {
    this.cartService.$cartItemsUpdated
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(carts => {
        this.itemsOnCart = carts[0]?.CartItems?.length || 0;
        // this.theCart = carts[0];
      });
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
    this.router.navigate(['/checkout'], { queryParams: { cartId, cartIds } }).then();
  }

  /**
   * Check if can write the number about the amount of product
   * @param event object with the number typed on keyCode prop
   * @param product product to affect
   * @param varBindOnFront Ref to var bind on front
   *
   * @return return true or false
   */
  checkMixMaxSale(event, product, varBindOnFront): boolean {
    console.log(event);
    const currentAmount = +event.target.value;
    const keyTyped = String.fromCharCode(event.keyCode);
    const finalNumber = +(currentAmount + '' + keyTyped);

    if ((finalNumber < product?.minSale) || (finalNumber > product?.maxSale)) {
      this.showToastr.showInfo(
        `Este producto tiene un mínimo de cantidad a vender de ${product?.minSale} y un máximo de ${product?.maxSale}`,
        'Atención',
        5000,
      );
      return false;
    }
    if ((finalNumber >= product?.minSale) && (finalNumber <= product?.maxSale)) {
      this.increment(product, finalNumber);
      varBindOnFront = finalNumber;
      return true;
    }
    return false;
  }
}
