import { CartItem, Cart } from './../../../modals/cart-item';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subscriber, Subject } from 'rxjs';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { ShowSnackbarService } from '../../../core/services/show-snackbar/show-snackbar.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  // Array
  public $cartItemsUpdated: Subject<any> = new Subject();
  public $paymentUpdate: Subject<any> = new Subject();
  public observer: Subscriber<{}>;
  url = environment.apiUrl + 'cart';
  urlCheckoutData = environment.apiUrl + 'checkout';
  loggedInUser = null;
  _unsubscribeAll: Subject<any>;
  language = null;
  carts: Cart[] = [];

  constructor(
    public snackBar: MatSnackBar,
    private loggedInUserService: LoggedInUserService,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private showToastr: ShowToastrService,
    private showSnackbar: ShowSnackbarService,
  ) {
    // Get product from Localstorage
    this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
    // console.log("TCL: CartService -> this.products", this.products);
    /////////////////////////////////////////////////

    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.$cartItemsUpdated.subscribe((data) => {
      this.carts = data;
    });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this.registerData();
      } else {
        this.carts = [];
      }
    });

    this.registerData();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public getShoppingCars(): CartItem[] {
    this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
    if (this.carts) {
      let shoppingCartsItems = [];
      for (let cartX of this.carts) {
        shoppingCartsItems = shoppingCartsItems.concat(cartX.CartItems);
      }
      return shoppingCartsItems;
    } else {
      return [];
    }
  }

  public getAsyncShoppingCars(): Observable<any> {
    let items = [];
    if (this.carts) {
      items = [];
    }
    const itemsStream = new Observable<any>((observer) => {
      observer.next([items]);
      observer.complete();
    });
    return itemsStream;
  }

  // Add to cart
  public async addToCart(product: any, quantity: number) {
    // if (this.loggedInUser && this.loggedInUserService.isMessengerUser()) {
    //   return alert(this.translate.instant('You can not make this action'));
    // }

    let message, status;
    const productName = product.name[this.language] ? product.name[this.language] : product.name['es'];
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    if (product.type != 'physical') {
      if (this._isInCart(product)) {
        message =
          this.translate.instant('The product ') + productName + this.translate.instant(' it is already in the cart.');
        status = 'error';
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 5000 });
        return;
      }
      if (this.loggedInUser) {
        return this.postCart({ ProductId: product.id, quantity: quantity })
          .then((data) => {
            console.log('CartService -> addToCart -> cart', data);
            this.carts = data.data;
            message =
              this.translate.instant('The product ') +
              '  ' +
              productName +
              '  ' +
              this.translate.instant(' has been added to cart.');
            status = 'success';
            this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
            this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
            this.$cartItemsUpdated.next(this.carts);
            return this.carts;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
        let cart = this._getSimpleCart(product.BusinessId);
        cart = cart ? cart : this._newSimpleCart(product, product.Business);
        if (!this.isSameMarket(cart, product)) {
          this.showToastr.showError(
            'Usted solo puede tener en su carrito elementos con la misma moneda a pagar',
            'Error',
            5000,
          );
          return;
        }

        const shoppingCartItems = cart.CartItems;
        const index = shoppingCartItems.findIndex((item) => item.ProductId == product.id);
        if (index > -1) {
          if (quantity != -1) {
            shoppingCartItems[index].quantity++;
          } else {
            shoppingCartItems[index].quantity--;
          }
          if (shoppingCartItems[index].quantity <= 0) {
            shoppingCartItems.splice(index, 1);
            cart.totalPrice = Math.max(0, cart.totalPrice);
          }
        } else {
          shoppingCartItems.push({
            ProductId: product.id,
            Product: product,
            quantity: quantity,
            StockId: product?.Stock?.id,
          });
        }
        cart.CartItems = [...shoppingCartItems];
        cart.totalPrice = this._calcTotalPrice(cart);
        message =
          this.translate.instant('The product ') +
          ' ' +
          productName +
          '  ' +
          this.translate.instant(' has been added to cart.');
        status = 'success';
        this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
        this._setSimpleCart(cart);
        this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
        this.$cartItemsUpdated.next(this.carts);
        return this.carts;
      }
    } else if (this.isCanStock(product, quantity)) {
      if (this.loggedInUser) {
        // if (this._isInCart(product) && quantity != -1) {
        //   quantity = 1;
        // }
        return this.postCart({ ProductId: product.id, quantity: quantity, StockId: product?.Stock?.id })
          .then((data) => {
            // console.log('CartService -> addToCart -> cart', data);
            this.carts = data.data;
            message =
              this.translate.instant('The product ') +
              '  ' +
              productName +
              '  ' +
              this.translate.instant(' has been added to cart.');
            status = 'success';
            this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
            this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
            this.$cartItemsUpdated.next(this.carts);
            return this.carts;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
        let cart = this._getSimpleCart(product.BusinessId);
        cart = cart ? cart : this._newSimpleCart(product, product.Business);
        if (!this.isSameMarket(cart, product)) {
          this.showToastr.showError(
            'Usted solo puede tener en su carrito elementos con la misma moneda a pagar',
            'Error',
            5000,
          );
          return;
        }

        const shoppingCartItems = cart.CartItems;
        const index = shoppingCartItems.findIndex((item) => item.ProductId == product.id);
        if (index > -1) {
          shoppingCartItems[index].quantity += quantity;
          // if (quantity != -1)
          //   shoppingCartItems[index].quantity++;
          // else {
          //   shoppingCartItems[index].quantity--;
          // }

          if (shoppingCartItems[index].quantity <= 0) {
            shoppingCartItems.splice(index, 1);
            cart.totalPrice = Math.max(0, cart.totalPrice);
          }
        } else {
          shoppingCartItems.push({
            ProductId: product.id,
            Product: product,
            quantity: quantity,
            StockId: product?.Stock?.id,
          });
        }
        cart.CartItems = [...shoppingCartItems];
        cart.totalPrice = this._calcTotalPrice(cart);
        console.log('CartService -> addToCart ->  this.cart.totalPrice', cart.totalPrice);
        message =
          this.translate.instant('The product ') +
          ' ' +
          productName +
          '  ' +
          this.translate.instant(' has been added to cart.');
        status = 'success';
        this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
        this._setSimpleCart(cart);
        this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
        this.$cartItemsUpdated.next(this.carts);
        return this.carts;
      }
    }
  }

  ////////////////FUNCIONES PARA MANEJAR EL ARREGLO DE CARRITOS//////////////////////

  _getSimpleCart(BusinessId) {
    const simpleCart = this.carts.find((item) => item.BusinessId == BusinessId);
    return simpleCart;
  }

  /**
   *
   * @param data
   * {Business, Product, Stock}
   * @returns
   */

  _newSimpleCart(Product?, Business?, Stock?): Cart {
    return {
      CartItems: [],
      totalPrice: 0.0,
      BusinessId: Product.BusinessId,
      Business: Business,
      market: Product.market,
    };
  }

  _setSimpleCart(cart: Cart) {
    const index = this.carts.findIndex((item) => item.BusinessId == cart.BusinessId);
    if (index == -1) {
      /*A new Cart to be added*/
      this.carts.push(cart);
    } else {
      this.carts[index] = cart;
    }
  }

  _removeSimpleCart(cart: Cart) {
    const index = this.carts.findIndex((item) => item.BusinessId == cart.BusinessId);
    if (index != -1) {
      console.log('CartService -> _removeSimpleCart -> index', index);
      this.carts.splice(index, 1);
      console.log('CartService -> _removeSimpleCart -> this.carts', this.carts);
    }
  }
  ////////////////////////////////////////////////////////////////////

  public async addToCartQuickly(product: any, quantity: number) {
    // console.log(product);
    // if (this.loggedInUser && this.loggedInUserService.isMessengerUser()) {
    //   return alert(this.translate.instant('You can not make this action'));
    // }

    let message, status;
    const hasItem = false;
    const productName = product.name[this.language] ? product.name[this.language] : product.name['es'];
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    if (product.type != 'physical') {
      if (this._isInCart(product)) {
        message =
          this.translate.instant('The product ') + productName + this.translate.instant(' it is already in the cart.');
        status = 'error';
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 5000 });
        return;
      }
      if (this.loggedInUser) {
        return this.postCart({ ProductId: product.id, quantity: quantity, StockId: product?.Stock?.id })
          .then((data) => {
            this.carts = data.data;
            message =
              this.translate.instant('The product ') + productName + this.translate.instant(' has been added to cart.');
            status = 'success';
            this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
            this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
            this.$cartItemsUpdated.next(this.carts);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
        let cart = this._getSimpleCart(product.BusinessId);
        cart = cart ? cart : this._newSimpleCart(product, product.Business);
        if (!this.isSameMarket(cart, product)) {
          this.showToastr.showError(
            'Usted solo puede tener en su carrito elementos con la misma moneda a pagar',
            'Error',
            5000,
          );
          return;
        }

        const shoppingCartItems = cart.CartItems;
        const index = shoppingCartItems.findIndex((item) => item.ProductId == product.id);
        if (index > -1) {
          // shoppingCartItems[index].quantity += quantity;
          if (quantity != -1) {
            shoppingCartItems[index].quantity++;
          } else {
            shoppingCartItems[index].quantity--;
          }
          if (shoppingCartItems[index].quantity <= 0) {
            shoppingCartItems.splice(index, 1);
            cart.totalPrice = Math.max(0, cart.totalPrice);
          }
        } else {
          shoppingCartItems.push({
            ProductId: product.id,
            Product: product,
            quantity: quantity,
            StockId: product?.Stock?.id,
          });
        }
        cart.CartItems = [...shoppingCartItems];
        cart.totalPrice = this._calcTotalPrice(cart);
        message =
          this.translate.instant('The product ') +
          ' ' +
          productName +
          '  ' +
          this.translate.instant(' has been added to cart.');
        status = 'success';
        this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
        this._setSimpleCart(cart);
        this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
        this.$cartItemsUpdated.next(this.carts);
      }
    } else if (this.isCanStock(product, quantity)) {
      if (this.loggedInUser) {
        if (this._isInCart(product) && quantity != -1) {
          quantity = 1;
        }
        return this.postCart({ ProductId: product.id, quantity: quantity, StockId: product?.Stock?.id })
          .then((data) => {
            this.carts = data.data;
            message =
              this.translate.instant('The product ') +
              '  ' +
              productName +
              '  ' +
              this.translate.instant(' has been added to cart.');
            status = 'success';
            this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
            this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
            this.$cartItemsUpdated.next(this.carts);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
        let cart = this._getSimpleCart(product.BusinessId);
        cart = cart ? cart : this._newSimpleCart(product, product.Business);
        // console.log('CartService -> addToCartQuickly -> cart', cart);
        if (!this.isSameMarket(cart, product)) {
          this.showToastr.showError(
            'Usted solo puede tener en su carrito elementos con la misma moneda a pagar',
            'Error',
            5000,
          );
          return;
        }
        const shoppingCartItems = cart.CartItems;
        const index = shoppingCartItems.findIndex((item) => item.ProductId == product.id);
        if (index > -1) {
          //shoppingCartItems[index].quantity += quantity;
          if (quantity != -1) {
            shoppingCartItems[index].quantity++;
          } else {
            shoppingCartItems[index].quantity--;
          }
          if (shoppingCartItems[index].quantity <= 0) {
            shoppingCartItems.splice(index, 1);
            cart.totalPrice = Math.max(0, cart.totalPrice);
          }
        } else {
          shoppingCartItems.push({
            ProductId: product.id,
            Product: product,
            quantity: quantity,
            StockId: product?.Stock?.id,
          });
        }
        cart.CartItems = [...shoppingCartItems];
        cart.totalPrice = this._calcTotalPrice(cart);
        message =
          this.translate.instant('The product ') +
          ' ' +
          productName +
          '  ' +
          this.translate.instant(' has been added to cart.');
        status = 'success';
        this.snackBar.open(message, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: 5000 });
        this._setSimpleCart(cart);
        this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
        this.$cartItemsUpdated.next(this.carts);
      }
    }
  }

  private isSameMarket(cart, product) {
    if (cart.market === product.market) {
      return true;
    }
    return false;
  }

  //CheckCart

  _isInCart(product): boolean {
    this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
    const cart = this._getSimpleCart(product.BusinessId);
    if (cart == undefined) {
      return false;
    }
    const shoppingCart = cart.CartItems;
    const searchResult = shoppingCart.find((item) => item.ProductId == product.id);
    return searchResult != undefined;
  }

  _calcTotalPrice(cart) {
    if (cart == undefined) {
      return 0;
    }
    let total = 0;
    for (const cartItem of cart.CartItems) {
      total += this.getPriceofProduct(cartItem.Product, cartItem.quantity) * cartItem.quantity;
    }
    return total;
  }

  // Calculate Product stock Counts
  public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
    const qty = product.quantity + quantity;
    const stock = product.Product?.Stock?.quantity || 0;
    console.log(product);
    if (stock < qty) {
      // this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
      this.snackBar.open('You can not choose more items than available. In stock ' + stock + ' items. ', '×', {
        panelClass: 'error',
        verticalPosition: 'top',
        duration: 5000,
      });
      return false;
    }
    return true;
  }
  // Calculate Product stock Counts
  public isCanStock(product: any, quantity): CartItem | Boolean {
    try {
      if (this.loggedInUser) {
        //validacion no se ha desde el front sino desde el api
        return true;
      }
      this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
      let cart = this._getSimpleCart(product.BusinessId);
      cart = cart ? cart : this._newSimpleCart(product, product.Business);

      const shoppingCart = cart.CartItems;
      const searchResult = shoppingCart.find((item) => item.ProductId == product.id);
      let qty;
      if (searchResult == undefined) {
        qty = quantity;
      } else {
        qty = searchResult.quantity + quantity;
      }
      const stock = product.Stock.quantity;
      const limit = product.maxSale;
      if (stock < qty) {
        const message =
          this.translate.instant('You can not choose more items than available. In stock ') +
          stock +
          this.translate.instant(' items.');
        this.snackBar.open(message, '×', {
          panelClass: 'error',
          verticalPosition: 'top',
          duration: 5000,
        });
        return false;
      }

      if (limit < qty) {
        const message =
          this.translate.instant('You can not choose more items than its max limit. Max limit is ') +
          limit +
          ' ' +
          this.translate.instant(' items.');
        // this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
        this.snackBar.open(message, '×', {
          panelClass: 'error',
          verticalPosition: 'top',
          duration: 5000,
        });
        return false;
      }
      return true;
    } catch (error) {
      this.showSnackbar.showError(this.translate.instant('Error', error.message), 8000);
      return false;
    }
  }

  // Removed in cart
  public async removeFromCart(item: CartItem) {
    if (item === undefined) {
      return false;
    }
    this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
    let cart = this._getSimpleCart(item?.Product?.BusinessId);
    cart = cart ? cart : this._newSimpleCart(item?.Product, item?.Product?.Business);
    if (item.id) {
      try {
        const data = await this.deleteCartItem(item);
        this.carts = data.data;
      } catch (error) {
        this.utilsService.errorHandle2(error);
        return;
      }
    } else {
      const index = cart.CartItems.findIndex((itemX) => itemX.ProductId == item.ProductId);

      if (index > -1) {
        const product = cart.CartItems[index].Product;
        const quantity = cart.CartItems[index].quantity;
        const price = this.getPriceofProduct(product, quantity);
        cart.CartItems.splice(index, 1);
        cart.totalPrice = this._calcTotalPrice(cart);
        if (cart.CartItems.length == 0) {
          this._removeSimpleCart(cart);
        }
      }
    }
    this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
    this.$cartItemsUpdated.next(this.carts);
  }

  public getPriceofProduct(product, quantity = 1) {
    const length = product.PriceRanges.length;
    if (product.offerValue) {
      for (const itemRange of product.PriceRanges) {
        if (quantity >= itemRange.min && quantity <= itemRange.max) {
          return itemRange.priceOffer;
        }
      }
      return product.PriceRanges[length - 1].priceOffer;
    }
    if (!product.offerValue) {
      for (const itemRange of product.PriceRanges) {
        if (quantity >= itemRange.min && quantity <= itemRange.max) {
          return itemRange.price;
        }
      }
      return product.PriceRanges[length - 1].price;
    }
  }

  // Total amount
  public getTotalAmount(cart?) {
    if (cart == undefined) {
      return 0.0;
    }
    return cart.totalPrice;
  }

  public getFullTotalAmount() {
    this.carts = this.loggedInUserService._getDataFromStorage('cartItem') || [];
    return this.carts.reduce((prev, curr) => {
      return prev + this.getTotalAmount(curr);
    }, 0.0);
  }

  /////////////////////////////////////////////////////////
  async registerData() {
    if (this.loggedInUser) {
      try {
        console.log('entre Aqui en el cart************************************');
        const localStorageCarts: Cart[] = this.loggedInUserService._getDataFromStorage('cartItem') || [];
        for (let cart of localStorageCarts) {
          let itemsNotRegistered = [];
          if (localStorageCarts) {
            itemsNotRegistered = cart?.CartItems?.filter((item) => !item.id);
          }

          if (itemsNotRegistered.length) {
            for (const itemPreCart of itemsNotRegistered) {
              await this.postCart(itemPreCart);
            }
          }
        }
        const tempCart = await this.getCart();
        this.carts = tempCart.data || [];
        this.loggedInUserService._setDataToStorage('cartItem', JSON.stringify(this.carts));
        this.$cartItemsUpdated.next(this.carts);
      } catch (error) {
        this.utilsService.errorHandle2(error);
      }
    }
  }

  postCart(data): Promise<any> {
    return this.httpClient.post<any>(this.url, data).toPromise();
  }

  getCart(): Promise<any> {
    return this.httpClient.get<any>(this.url).toPromise();
  }

  getCartData(body): Promise<any> {
    return this.httpClient.post<any>(this.url + '/checkout-data', body).toPromise();
  }

  getCartNoLogged(): Cart[] {
    let x = this.loggedInUserService._getDataFromStorage('cartItem') || [];
    return x;
  }

  deleteCartItem(data): Promise<any> {
    return this.httpClient.post<any>(this.url + '/delete', data).toPromise();
  }

  getCheckoutData(params?): Observable<any> {
    let httpParams = new HttpParams();
    if (params && params.CountryId) {
      httpParams = httpParams.set('CountryId', params.CountryId);
    }
    return this.httpClient.get(this.urlCheckoutData, { params: httpParams });
  }
}
