import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from './../../../../modals/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from './../../../../../environments/environment';
import { Subject } from 'rxjs';
import { IPagination } from './../../../../core/classes/pagination.class';
import { UtilsService } from './../../../../core/services/utils/utils.service';
import { CurrencyService } from './../../../../core/services/currency/currency.service';
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';

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

  queryPopular: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: 'rating',
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

    this.productService.getPopularProduct(this.queryPopular).subscribe((data: any) => {
      this.popularProducts = data.data;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
