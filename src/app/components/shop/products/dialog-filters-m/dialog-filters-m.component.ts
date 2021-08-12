import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPagination } from '../../../../core/classes/pagination.class';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { Subject } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { CategoriesService } from 'src/app/core/services/categories/catagories.service';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog-filters-m',
  templateUrl: './dialog-filters-m.component.html',
  styleUrls: ['./dialog-filters-m.component.scss'],
})
export class DialogFiltersMComponent implements OnInit, OnDestroy {
  public animation: any; // Animation
  public page: any;

  public allProducts: any[] = [];
  initLimit = 10;
  pageSizeOptions: number[] = [this.initLimit, 20, 50];
  resetPrices = false;

  queryProduct: IPagination = {
    limit: this.initLimit,
    offset: 0,
    page: 0,
    total: 0,
    order: '-rating',
  };

  paramsSearch: any = {
    filterText: null,
    categoryIds: [],
    brandIds: [],
    rating: 0,
    minPrice: 1,
    maxPrice: 20000,
  };

  loading = false;
  language: any;
  _unsubscribeAll: Subject<any>;
  isOnlyTwoProducts = false;
  categoriesIds: any[] = [];
  brandsIds: any[] = [];
  isHandset = false;
  productId = null;
  allCategories: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private productService: ProductService,
    public currencyService: CurrencyService,
    private categoryService: CategoriesService,
    private router: Router,
    public loggedInUserService: LoggedInUserService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogFiltersMComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';

    this.productService.getCountProduct().subscribe((data) => {
      this.isOnlyTwoProducts = data.data.count <= 2;
    });

    this.route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loading = true;
      this.paramsSearch.categoryIds = data && data.categoryIds ? data.categoryIds : this.paramsSearch.categoryIds;
      this.paramsSearch.brandIds = data && data.brandIds ? data.brandIds : [];
      this.paramsSearch.minPrice = data && data.minPrice ? data.minPrice : 0;
      this.paramsSearch.maxPrice = data && data.maxPrice ? data.maxPrice : 2000;
      this.queryProduct.limit = data && data.limit ? data.limit : this.initLimit;
      this.queryProduct.offset = data && data.offset ? data.offset : 0;
      this.queryProduct.total = data && data.total ? data.total : 0;
      this.queryProduct.page = data && data.page ? data.page : 0;
      this.queryProduct.order = data.order || '-rating';
      this.productId = this.productService.productIdDetails ? this.productService.productIdDetails : null;
      if (data.CategoryId) {
        this.paramsSearch.categoryIds = [data.CategoryId];
        this.paramsSearch.minPrice = 0;
        this.paramsSearch.maxPrice = 10000;
        this.resetPrices = !this.resetPrices;
        this.queryProduct.limit = this.initLimit;
        this.queryProduct.offset = 0;
        this.queryProduct.total = 0;
        this.queryProduct.page = 0;
      }
      if (this.paramsSearch.filterText != data.filterText) {
        this.paramsSearch.filterText = data.filterText;
        this.paramsSearch.minPrice = 0;
        this.paramsSearch.maxPrice = 10000;
        this.resetPrices = !this.resetPrices;
        this.queryProduct.limit = this.initLimit;
        this.queryProduct.offset = 0;
        this.queryProduct.total = 0;
        this.queryProduct.page = 0;
        this.paramsSearch.categoryIds = [];
      }

      this.categoriesIds = [...this.paramsSearch.categoryIds];
      this.brandsIds = [...this.paramsSearch.brandIds];
      this.allProducts = [];
    });
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
    this.categoryService.getAllCategories().subscribe((data) => {
      this.allCategories = data.data;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  // Update price filter
  updatePriceFilters(price: any) {
    this.paramsSearch.minPrice = price.priceFrom;
    this.paramsSearch.maxPrice = price.priceTo;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
  }
  // Update Brands filter
  onBrandsChanged(brandIds) {
    this.paramsSearch.brandIds = brandIds;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
  }

  // Update Categories filter
  onCategoriesChanged(categoryIds) {
    this.paramsSearch.categoryIds = categoryIds;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
  }
  save() {
    this.dialogRef.close({
      paramsSearch: this.paramsSearch,
      queryProduct: this.queryProduct,
    });
  }
  close() {
    this.dialogRef.close();
  }
}
