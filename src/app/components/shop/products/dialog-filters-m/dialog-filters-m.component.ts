import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { IPagination } from '../../../../core/classes/pagination.class';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { Subject } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { CategoriesService } from '../../../backend/services/categories/catagories.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog-filters-m',
  templateUrl: './dialog-filters-m.component.html',
  styleUrls: ['./dialog-filters-m.component.scss']
})
export class DialogFiltersMComponent implements OnInit {
  public animation: any; // Animation
  public sortByOrder: any = ''; // sorting
  public page: any;
  public viewType = 'grid';
  public viewCol = 100;

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
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogFiltersMComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';

    this.productService.getCountProduct().subscribe((data) => {
      this.isOnlyTwoProducts = data.data.count <= 2;
    });

    this.route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      console.log('Subscricion de navegacion -> data', data);
      this.loading = true;
      this.paramsSearch.categoryIds = data && data.categoryIds ? data.categoryIds : this.paramsSearch.categoryIds;
      this.paramsSearch.brandIds = data && data.brandIds ? data.brandIds : [];
      this.paramsSearch.minPrice = data && data.minPrice ? data.minPrice : 0;
      this.paramsSearch.maxPrice = data && data.maxPrice ? data.maxPrice : 2000;
      this.queryProduct.limit = data && data.limit ? data.limit : this.initLimit;
      this.queryProduct.offset = data && data.offset ? data.offset : 0;
      this.queryProduct.total = data && data.total ? data.total : 0;
      this.queryProduct.page = data && data.page ? data.page : 0;
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
      this.allProducts = [];
      this.search();
    });
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.isHandset = data.matches;
      });

    this.categoryService.getAllCategories().subscribe((data) => {
      this.allCategories = data.data;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  //////////////////////////// BUSQUEDA ////////////////////////////////

  searchProducts() {
    this.loading = true;
    // console.log('ProductLeftSidebarComponent -> searchProducts -> queryParams', this.queryProduct);

    this.router.navigate(['/products/search'], {
      queryParams: {
        ...this.paramsSearch,
        ...this.queryProduct,
      },
    });
  }

  search() {
    this.productService.searchProduct({ ...this.queryProduct }, { ...this.paramsSearch }).subscribe(
      (data) => {
        this.allProducts = data.data;
        // this.queryProduct.offset += data.meta.pagination.count;
        this.queryProduct.total = data.meta.pagination.total;
        this.loading = false;
        this.gotToProductId();
      },
      () => {
        this.loading = false;
      },
    );
  }
  showChips() {
    let chips = [];
    for (let cat of this.allCategories) {
      let a = this.categoriesIds.find((i) => i == cat.id);
      if (a) {
        chips.push(cat);
      }
    }
    return chips;
  }

  // Animation Effect fadeIn
  public fadeIn() {
    this.animation = 'fadeIn';
  }

  OnPaginatorChange(event) {
    console.log('Entre qui en el evento');
    if (event) {
      console.log('ProductLeftSidebarComponent -> OnPaginatorChange -> event', event);
      this.queryProduct.limit = event.pageSize || this.initLimit;
      this.queryProduct.offset = event.pageIndex * event.pageSize;
      this.queryProduct.page = event.pageIndex;
    } else {
      this.queryProduct.limit = this.initLimit;
      this.queryProduct.offset = 0;
      this.queryProduct.page = 1;
    }
    this.searchProducts();
    const element = document.getElementById('topSearchBar');
    element.scrollIntoView();
  }

  // Update price filter
  updatePriceFilters(price: any) {
    // console.log(price);
    this.paramsSearch.minPrice = price.priceFrom;
    this.paramsSearch.maxPrice = price.priceTo;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
    setTimeout(() => {
      this.searchProducts();
    }, 250);
  }
  // Update Brands filter
  onBrandsChanged(brandIds) {
    this.paramsSearch.brandIds = brandIds;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
    console.log('Entre en el cambio de Brands');
    this.paginator.firstPage();
    setTimeout(() => {
      this.searchProducts();
    }, 150);
  }

  // Update Categories filter
  onCategoriesChanged(categoryIds) {
    this.paramsSearch.categoryIds = categoryIds;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
    console.log('Entre en el cambio de Categories');
    this.paginator.firstPage();
    setTimeout(() => {
      this.searchProducts();
    }, 150);
  }

  //////////////////////////
  gotToProductId() {
    // console.log('ProductLeftSidebarComponent -> gotToProductId -> this.productId', this.productId);
    if (this.productId) {
      setTimeout(() => {
        const element = document.getElementById(`ProductCardId${this.productId}`);
        if (element) {
          element.scrollIntoView(false);
          this.productService.productIdDetails = undefined;
        }
      });
    }
  }
  save() {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }

}
