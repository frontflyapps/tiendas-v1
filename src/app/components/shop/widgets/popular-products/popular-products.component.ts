import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from '../../../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { IProductData } from '../../products/product-vertical/product-vertical.component';
import { LocalStorageService } from '../../../../core/services/localStorage/localStorage.service';
import { FRONT_PRODUCT_DATA } from '../../../../core/classes/global.const';
import { UtilsService } from '../../../../core/services/utils/utils.service';

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

  public productsData$: Observable<IProductData>;
  private getProduct = new Subject<any>();

  // queryPopular: IPagination = {
  //   limit: 3,
  //   offset: 0,
  //   total: 0,
  //   order: 'rating',
  // };

  constructor(
    private localStorageService: LocalStorageService,
    private productService: ProductService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });


    this.setServiceGetProduct();
    this.getPFDFromStorage();

    // this.productService.getPopularProduct(this.queryPopular).subscribe((data: any) => {
    //   this.popularProducts = data.data;
    // });
  }

  setServiceGetProduct() {
    this.productsData$ = this.getProduct.pipe(
      distinctUntilChanged(),
      switchMap(() => this.productService.getFrontProductsData()),
    );

    this.productsData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
          const _response: any = JSON.parse(JSON.stringify(response));
          this.setValuesFromResponse(_response);
          _response.timespan = new Date().getTime();
          this.localStorageService.setOnStorage(FRONT_PRODUCT_DATA, _response);
        },
      );
  }

  getProducts() {
    this.getProduct.next();
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
