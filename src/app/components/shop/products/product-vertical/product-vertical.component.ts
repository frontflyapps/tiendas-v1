import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { Observable, of, Subject } from 'rxjs';
import { IPagination } from '../../../../core/classes/pagination.class';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { environment } from '../../../../../environments/environment';
import { IProductCard } from '../../../../core/classes/product-card.class';

export interface IProductData {
  lastCreated: IProductCard[];
  rating: IProductCard[];
  isFeatured: IProductCard[];
}

@Component({
  selector: 'app-product-vertical',
  templateUrl: './product-vertical.component.html',
  styleUrls: ['./product-vertical.component.scss'],
})
export class ProductVerticalComponent implements OnInit, OnDestroy {
  imageUrl = environment.imageUrl;
  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;

  popularProducts: IProductCard[] = [];
  featuredProducts: IProductCard[] = [];
  allProducts: IProductCard[] = [];

  public productsData$: Observable<IProductData>;
  private getProduct = new Subject<any>();

  queryPopular: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: 'rating',
  };

  queryFeatured: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  queryAll: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  constructor(
    private utilsService: UtilsService,
    public currencyService: CurrencyService,
    private productService: ProductService,
    public loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    // this.productService.getPopularProduct(this.queryPopular).subscribe((data: any) => {
    //   this.popularProducts = data.data;
    // });
    //
    // this.productService.getFeaturedProducts(this.queryFeatured).subscribe((data: any) => {
    //   this.featuredProducts = data.data;
    // });
    //
    this.productService.getAllProducts(this.queryAll).subscribe((data: any) => {
      this.allProducts = data.data;
    });

    // //////////////////////////////////////////////////////////////////////
    // Pruebas Damian
    // this.productService.getFrontProductsData().subscribe((data: any) => {
    //   this.allProducts = data.data;
    // });

    this.setServiceGetProduct();
    this.getProducts();
  }

  setServiceGetProduct() {
    this.productsData$ = this.getProduct.pipe(
      distinctUntilChanged(),
      switchMap(() => this.productService.getFrontProductsData()),
    );

    this.productsData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
          this.popularProducts = response.rating;
          this.featuredProducts = response.isFeatured;
          // this.allProducts = response.lastCreated;
        },
      );
  }

  getProducts() {
    this.getProduct.next();
  }

  ngOnDestroy() {
    if (this._unsubscribeAll) {
      this._unsubscribeAll.next(true);
      this._unsubscribeAll.complete();
      this._unsubscribeAll.unsubscribe();
    }
  }
}
