import { MetaService } from '../../../../core/services/meta.service';
import { IPagination } from '../../../../core/classes/pagination.class';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogFiltersMComponent } from '../dialog-filters-m/dialog-filters-m.component';
import { CategoriesService } from 'src/app/core/services/categories/catagories.service';
import { CartService } from '../../../shared/services/cart.service';
import { Cart } from '../../../../modals/cart-item';
import { LocationService } from '../../../../core/services/location/location.service';
import { PRODUCT_COUNT } from '../../../../core/classes/global.const';
import { environment } from '../../../../../environments/environment';
import { LocalStorageService } from '../../../../core/services/localStorage/localStorage.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { DialogSetLocationComponent } from '../../../main/dialog-set-location/dialog-set-location.component';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss'],
})
export class ProductLeftSidebarComponent implements OnInit, OnDestroy {
  public animation: any; // Animation
  public sortByOrder: any = ''; // sorting
  public page: any;
  public viewType = 'grid';
  public viewCol = 100;
  public noResults: boolean;

  public itemsOnCart = 0;
  public theCart: Cart;
  public allProducts: any[] = [];
  public allProductsResponse: any[] = [];
  public province: any = null;
  public municipality: any = null;
  public amountInitialResults = 3;
  public numberOfSearchBase = 0;
  public totalPages =0;
  public numberOfSearch = 0;
  private isStarting = true;
  resetPrices = false;
  paramsSearch: any = {
    filterText: null,
    categoryIds: [],
    brandIds: [],
    rating: 0,
    minPrice: 1,
    maxPrice: null,
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
  private isFromMoreProductBtn = false;
  private globalScrollTopS = 0;
  private globalScrollTopOth = 0;
  public initLimit = environment.limitSearch;
  pageSizeOptions: number[] = [this.initLimit, 42, 100];
  queryProduct: IPagination = {
    limit: this.initLimit,
    offset: 0,
    page: 1,
    total: 0,
    order: '-rating',
  };

  constructor(
    private productService: ProductService,
    public currencyService: CurrencyService,
    private categoryService: CategoriesService,
    private router: Router,
    public loggedInUserService: LoggedInUserService,
    private localStorageService: LocalStorageService,
    private breakpointObserver: BreakpointObserver,
    public cartService: CartService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private metaService: MetaService,
    private locationService: LocationService,
    public translate: TranslateService,
    public utilsService: UtilsService,
  ) {
    // this.metaService.setMeta(
    //   'Todos los productos',
    //   'Encuentra lo que buscas',
    //   environment.meta?.mainPage.shareImg,
    //   environment.meta?.mainPage?.keywords,
    // );
    this.initSubsLocation();
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.isStarting = true;
      // this.paramsSearch.categoryIds = data?.categoryIds ? data.categoryIds : this.paramsSearch.categoryIds;
      this.paramsSearch.categoryIds = data?.categoryIds ? data.categoryIds : [];
      this.paramsSearch.brandIds = data?.brandIds ? data.brandIds : [];
      this.paramsSearch.minPrice = data?.minPrice ? data.minPrice : 0;
      this.paramsSearch.maxPrice = data?.maxPrice ? data.maxPrice : null;

      this.productId = this.productService.productIdDetails ? this.productService.productIdDetails : null;

      this.queryProduct.limit = data?.limit ? data.limit : this.initLimit;
      this.queryProduct.offset = data?.offset ? data.offset : 0;
      this.queryProduct.total = data?.total ? data.total : 0;
      this.queryProduct.page = data?.page ? data.page : 1;
      this.queryProduct.order = data?.order ? data.order : '-id';

      if (data.CategoryId) {
        this.paramsSearch.categoryIds = [data.CategoryId];
        this.paramsSearch.minPrice = 0;
        this.paramsSearch.maxPrice = null;
        this.resetPrices = !this.resetPrices;

        this.queryProduct.limit = this.initLimit;
        this.queryProduct.offset = 0;
        this.queryProduct.total = 0;
        this.queryProduct.page = 1;
      }
      if (this.paramsSearch.filterText != data.filterText) {
        this.paramsSearch.filterText = data.filterText;
        this.paramsSearch.minPrice = 0;
        this.paramsSearch.maxPrice = null;
        this.resetPrices = !this.resetPrices;

        this.queryProduct.limit = this.initLimit;
        this.queryProduct.offset = 0;
        this.queryProduct.total = 0;
        this.queryProduct.page = 1;
        this.paramsSearch.categoryIds = [];
      }

      this.categoriesIds = [...this.paramsSearch.categoryIds];
      this.brandsIds = [...this.paramsSearch.brandIds];

      if (this.isFromMoreProductBtn && this.amountInitialResults < this.numberOfSearch) {
        this.isFromMoreProductBtn = false;
        setTimeout(() => {
          document.body.scrollTop = this.globalScrollTopS; // Safari
          document.documentElement.scrollTop = this.globalScrollTopOth; // Other
        }, 0);
      } else {
        this.loading = true;
      }

      this.newSearchMethod(this.queryProduct.page);
    });

  }

  ngOnInit() {
    this.subsCartChange();

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.isHandset = data.matches;
      });

    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        // this.allCategories = data.data;
        this.categoryService.allCategories = data.data;
      });

    this.getPFDFromStorage();
  }

  getPFDFromStorage() {
    try {
      const count = this.localStorageService.getFromStorage(PRODUCT_COUNT);

      if (!count) {
        this.getProductCount();
        return;
      }

      if (this.localStorageService.iMostReSearch(count?.timespan, environment.timeToResearchProductData)) {
        this.getProductCount();
      } else {
        this.setIsOnlyTwoProducts(count);
      }
    } catch (e) {
      this.getProductCount();
    }
  }

  getProductCount() {
    this.productService.getCountProduct().subscribe((data) => {
      const _response: any = {};
      _response.count = JSON.parse(JSON.stringify(data.data.count));
      _response.timespan = new Date().getTime();
      this.localStorageService.setOnStorage(PRODUCT_COUNT, _response);

      this.setIsOnlyTwoProducts(_response.count);
    });
  }

  setIsOnlyTwoProducts(count) {
    this.isOnlyTwoProducts = count <= 2;
  }

  initValuesOnSearch() {
    this.queryProduct.limit = environment.limitSearch;
    this.queryProduct.offset = 0;
    this.queryProduct.page = 1;
    this.numberOfSearch = this.numberOfSearchBase;
  }

  subsCartChange() {
    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((carts) => {
      this.itemsOnCart = carts[0]?.CartItems?.length || 0;
      this.theCart = carts[0];
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  // ////////////////////////// BUSQUEDA ////////////////////////////////

  searchProducts() {
    this.loading = true;
    this.isStarting = true;

    this.router
      .navigate(['/products/search'], {
        queryParams: {
          resfreshId: Math.random(),
          ...this.paramsSearch,
          ...this.queryProduct,
        },
      }).then();
    // this.router.onSameUrlNavigation = 'reload';
  }

  searchMoreProducts() {
    // this.loading = true;
    this.isFromMoreProductBtn = true;

    // this.router
    //   .navigate(['/products/search'], {
    //     queryParams: {
    //       ...this.paramsSearch,
    //       ...this.queryProduct,
    //     },
    //   })
    //   .then(() => (this.loading = false));

    this.search();
  }

  search() {
    let brandIds: number[] = null;
    let categoryIds: number[] = null;

    if (this.paramsSearch.categoryIds) {
      if (Array.isArray(this.paramsSearch.categoryIds)) {
        if (this.paramsSearch.categoryIds.length > 0) {
          categoryIds = this.paramsSearch.categoryIds.map((i) => Number(i));
        }
      } else {
        categoryIds = [this.paramsSearch.categoryIds];
      }
    }

    // if (Array.isArray(this.paramsSearch.brandIds) && this.paramsSearch.brandIds.length > 0) {
    if (this.paramsSearch.categoryIds) {
      if (Array.isArray(this.paramsSearch.brandIds)) {
        if (this.paramsSearch.brandIds.length > 0) {
          brandIds = this.paramsSearch.brandIds.map((i) => Number(i));
        }
      } else {
        brandIds = [this.paramsSearch.brandIds];
      }
    }

    const body: any = {
      limit: this.queryProduct?.limit ? +this.queryProduct?.limit : 0,
      offset: this.queryProduct?.offset ? +this.queryProduct?.offset : 0,
      page: this.queryProduct?.page ? +this.queryProduct?.page : 0,
      total: this.queryProduct?.total ? +this.queryProduct?.total : 0,
      order: this.queryProduct?.order ? this.queryProduct?.order : null,
      BrandIds: brandIds,
      CategoryIds: categoryIds,
      maxPrice: this.paramsSearch?.maxPrice ? +this.paramsSearch?.maxPrice : 0,
      minPrice: this.paramsSearch?.minPrice ? +this.paramsSearch?.minPrice : 0,
      rating: this.paramsSearch?.rating ? +this.paramsSearch?.rating : null,
      text: this.paramsSearch?.filterText ? this.paramsSearch?.filterText : null,
      ProvinceId: this.province?.id || null,
      MunicipalityId: this.municipality?.id || null,
    };
    this.productService
      .searchProduct(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data: any) => {
          // this.loading = true;
          if (this.isStarting) {
            this.allProducts = [];
            this.allProducts = data.data.slice(0, this.initLimit * (this.numberOfSearch + 1));
            this.allProductsResponse = data.data;
            this.noResults = data.info;
            console.log('allProductsResponse length: ' + this.allProductsResponse.length);
            this.isStarting = false;
            setTimeout(() => {
              document.body.scrollTop = 0; // Safari
              document.documentElement.scrollTop = 0; // Other
            }, 0);
          } else {
            this.allProductsResponse = this.allProductsResponse.concat(data.data);
            this.allProducts = this.allProductsResponse.slice(0, this.initLimit * (this.numberOfSearch + 1));
          }

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

    let allCategories = this.categoryService?.allCategories;

    if (!Array.isArray(allCategories)) {
      allCategories = [];
    }

    for (let cat of allCategories) {
      let a = this.categoriesIds.find((i) => i == cat.id);
      if (a) {
        chips.push(cat);
      }
    }
    return chips;
  }

  onRemoveCategory(cat) {
    let x = this.categoriesIds.findIndex((x) => x == cat.id);
    if (x > -1) {
      this.categoriesIds.splice(x, 1);
      this.onCategoriesChanged([...this.categoriesIds]);
    }
  }

  // /////////////////////////////////////////////////////////////////

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  // Animation Effect fadeIn
  public fadeIn() {
    this.animation = 'fadeIn';
  }

  // Animation Effect fadeOut
  public fadeOut() {
    this.animation = 'fadeOut';
  }

  // Update tags filter
  public updateTagFilters(tags: any[]) {
    this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
  }

  // sorting type ASC / DESC / A-Z / Z-A etc.

  onSetOrder(order) {
    this.queryProduct.order = order;
    this.initValuesOnSearch();
    this.searchProducts();
  }

  goToFirstPage(event) {
    // this.isStarting = true;
    event.preventDefault();

    // this.globalScrollTopS = document.body.scrollTop; // Safari
    // this.globalScrollTopOth = document.documentElement.scrollTop; // Other

    setTimeout(() => {
      document.body.scrollTop = 0; // Safari
      document.documentElement.scrollTop = 0; // Other
    }, 0);
  }

  getCountPage(total) {
      return total % 21 ? Math.ceil(total / 21) : (total / 21 > 0 ? total / 21 : 1);
  }
  newSearchMethod(page) {
    let currentPage = page > 0 ? page - 1 : page;
    this.queryProduct.page = currentPage;
    this.queryProduct.offset = currentPage * this.initLimit;
    // this.searchMoreProducts();
    let brandIds: number[] = null;
    let categoryIds: number[] = null;

    if (this.paramsSearch.categoryIds) {
      if (Array.isArray(this.paramsSearch.categoryIds)) {
        if (this.paramsSearch.categoryIds.length > 0) {
          categoryIds = this.paramsSearch.categoryIds.map((i) => Number(i));
        }
      } else {
        categoryIds = [this.paramsSearch.categoryIds];
      }
    }

    // if (Array.isArray(this.paramsSearch.brandIds) && this.paramsSearch.brandIds.length > 0) {
    if (this.paramsSearch.categoryIds) {
      if (Array.isArray(this.paramsSearch.brandIds)) {
        if (this.paramsSearch.brandIds.length > 0) {
          brandIds = this.paramsSearch.brandIds.map((i) => Number(i));
        }
      } else {
        brandIds = [this.paramsSearch.brandIds];
      }
    }

    const body: any = {
      limit: 21,
      offset: this.queryProduct?.offset ? +this.queryProduct?.offset : 0,
      page: this.queryProduct?.page ? +this.queryProduct?.page : 0,
      total: this.queryProduct?.total ? +this.queryProduct?.total : 0,
      order: this.queryProduct?.order ? this.queryProduct?.order : null,
      BrandIds: brandIds,
      CategoryIds: categoryIds,
      maxPrice: this.paramsSearch?.maxPrice ? +this.paramsSearch?.maxPrice : 0,
      minPrice: this.paramsSearch?.minPrice ? +this.paramsSearch?.minPrice : 0,
      rating: this.paramsSearch?.rating ? +this.paramsSearch?.rating : null,
      text: this.paramsSearch?.filterText ? this.paramsSearch?.filterText : null,
      ProvinceId: this.province?.id || null,
      MunicipalityId: this.municipality?.id || null,
    };
    this.productService
      .searchProduct(body)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data: any) => {
          // this.loading = true;

            this.allProducts = data.data;
            this.totalPages = data.meta.total / 21;
            if (data.meta.total % 21) {
              this.totalPages++;
            }
            // this.allProducts = data.data.slice(0, this.initLimit * (this.numberOfSearch + 1));
            // this.allProductsResponse = data.data;
            // this.noResults = data.info;
            // console.log('allProductsResponse length: ' + this.allProductsResponse.length);
            // this.isStarting = false;
            setTimeout(() => {
              document.body.scrollTop = 0; // Safari
              document.documentElement.scrollTop = 0; // Other
            }, 0);


          this.queryProduct.total = data.meta.pagination.total;
          this.loading = false;
          this.gotToProductId();
        },
        () => {
          this.loading = false;
        },
      );
  }

  seeMoreProductsBtn(event) {
    event.preventDefault();

    this.globalScrollTopS = document.body.scrollTop; // Safari
    this.globalScrollTopOth = document.documentElement.scrollTop; // Other

    this.numberOfSearch++;
    if (this.numberOfSearch % 3 > 0) {
      this.allProducts = this.allProductsResponse.slice(0, this.initLimit * (this.numberOfSearch + 1));
      this.queryProduct.offset = this.initLimit;
      console.log('limit', this.queryProduct.limit);
    } else {
      // this.numberOfSearch = this.numberOfSearchBase;
      this.queryProduct.page++;
      this.queryProduct.offset = this.initLimit * this.amountInitialResults * this.queryProduct.page;
      this.searchMoreProducts();
    }
  }

  OnPaginatorChange(event) {
    if (event) {
      this.queryProduct.limit = event.pageSize || this.initLimit;
      this.queryProduct.offset = event.pageIndex * event.pageSize;
      this.queryProduct.page = event.pageIndex;
    } else {
      this.queryProduct.limit = this.initLimit;
      this.queryProduct.offset = 0;
      this.queryProduct.page = 1;
    }
    this.searchProducts();
    // const element = document.getElementById('topSearchBar');
    // element.scrollIntoView(true);
  }

  // Update price filter
  updatePriceFilters(price: any) {
    this.paramsSearch.minPrice = price.priceFrom;
    this.paramsSearch.maxPrice = price.priceTo;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;

    // this.allProducts = [];
    setTimeout(() => {
      this.searchProducts();
    }, 250);
  }

  onChangeRating() {
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;
    this.allProducts = [];
    this.initValuesOnSearch();
    // this.paginator.firstPage();
    setTimeout(() => {
      this.searchProducts();
    }, 150);
  }

  // Update Brands filter
  onBrandsChanged(brandIds) {
    this.paramsSearch.brandIds = brandIds;
    this.queryProduct.limit = this.initLimit;
    this.queryProduct.offset = 0;
    this.queryProduct.total = 0;

    // this.allProducts = [];
    this.initValuesOnSearch();
    // this.paginator.firstPage();
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
    // this.allProducts = [];
    this.initValuesOnSearch();
    // this.paginator.firstPage();
    setTimeout(() => {
      this.searchProducts();
    }, 150);
  }

  //////////////////////////
  gotToProductId() {
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

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '100vw';
    let dialogRef = this.dialog.open(DialogFiltersMComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.paramsSearch = { ...data.paramsSearch };
        this.queryProduct = { ...data.queryProduct };
        this.searchProducts();
      }
    });
  }

  // ============= LOCATION ==================================
  initSubsLocation() {
    this.locationService.location$.subscribe((newLocation) => {
      let nowLocation = JSON.parse(localStorage.getItem('location'));
      this.setLocationData(newLocation);
      if ( newLocation ) {
        // console.log(nowLocation?.province?.id !== newLocation.province?.id);
        // console.log(nowLocation?.municipality?.id !== newLocation.municipality?.id);
        if ( nowLocation?.province?.id !== newLocation.province?.id || nowLocation?.municipality?.id !== newLocation.municipality?.id ) {
          this.allProducts = [];
          // console.log('entro');
          this.searchProducts();
        }

      }
    });
  }

  setLocationData(locationOnLocalStorage) {
    this.municipality = locationOnLocalStorage.municipality;
    this.province = locationOnLocalStorage.province;
  }
}
