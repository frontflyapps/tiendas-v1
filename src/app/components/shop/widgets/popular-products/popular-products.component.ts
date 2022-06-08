import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from '../../../../../environments/environment';
import { Subject } from 'rxjs';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '../../../../core/services/localStorage/localStorage.service';
import { FRONT_PRODUCT_DATA } from '../../../../core/classes/global.const';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { GlobalStateOfCookieService } from '../../../../core/services/request-cookie-secure/global-state-of-cookie.service';

@Component({
  selector: 'app-popular-products',
  templateUrl: './popular-products.component.html',
  styleUrls: ['./popular-products.component.scss'],
})
export class PopularProductsComponent implements OnInit, OnDestroy {
  imageUrl = environment.imageUrl;
  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;

  popularProducts: any[] = [];

  // queryPopular: IPagination = {
  //   limit: 3,
  //   offset: 0,
  //   total: 0,
  //   order: 'rating',
  // };

  constructor(
    private productService: ProductService,
    private localStorageService: LocalStorageService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    private globalStateOfCookieService: GlobalStateOfCookieService
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.globalStateOfCookieService.getCookieState()
      ? this.initComponent()
      : this.setSubscriptionToCookie();
  }

  initComponent() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });


    this.setServiceGetProduct();
    this.getPFDFromStorage();

    // this.productService.getPopularProduct(this.queryPopular).subscribe((data: any) => {
    //   this.popularProducts = data.data;
    // });
  }

  setSubscriptionToCookie() {
    this.globalStateOfCookieService.stateOfCookie$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((thereIsCookie) => {
        if (thereIsCookie) {
          this.initComponent();
        }
      });
  }

  setServiceGetProduct() {
    this.productService.productsData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
          this.setValuesFromResponse(response);
        },
      );
  }

  getProducts() {
    this.productService.getProduct.next();
  }

  getPFDFromStorage() {
    const pfd = this.localStorageService.getFromStorage(FRONT_PRODUCT_DATA);

    if (!pfd) {
      this.getProducts();
      return;
    }

    if (this.localStorageService.iMostReSearch(pfd.timespan, environment.timeToResearchProductData)) {
      this.getProducts();
    } else {
      this.setValuesFromResponse(pfd);
    }
  }

  setValuesFromResponse(response) {
    this.popularProducts = UtilsService.getAnArrayFromIdsAndArray(response.products, response.rating);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
