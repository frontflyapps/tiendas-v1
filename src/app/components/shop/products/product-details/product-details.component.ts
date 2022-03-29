import { MetaService } from 'src/app/core/services/meta.service';
import { ShowToastrService } from '../../../../core/services/show-toastr/show-toastr.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../shared/services/cart.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../../modals/product.model';
import { ProductDataService, ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { IPagination } from '../../../../core/classes/pagination.class';
import { environment } from '../../../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Cart } from 'src/app/modals/cart-item';
import { BiconService } from 'src/app/core/services/bicon/bicon.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SocialMediaComponent } from './social-media/social-media.component';
import { LANDING_PAGE, PRODUCT_COUNT } from '../../../../core/classes/global.const';
import { LocalStorageService } from '../../../../core/services/localStorage/localStorage.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  isLoading = true;
  product: any = {};
  products: any[] = [];
  relatedProduct: any[] = [];
  featuredProducts: any[] = [];
  imageUrl = environment.imageUrl;
  arrayImages: any[] = [];
  mainImage = null;
  changeImage = false;
  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  reviewForm: FormGroup;
  loadingReviews = false;
  allReviews = [];
  showZoom = false;
  public image: any;
  public counter = 1;
  index: number;

  localDatabaseUsers = environment.localDatabaseUsers;
  loadingFeatured = false;
  loadingRelated = false;
  loadingMenu = false;

  pathToRedirect: any;
  paramsToUrlRedirect: any;

  public allProductsOnMenu = [];
  public allProductsOnMenuToShow: Observable<any[]>;

  searchProductControl = new FormControl();

  url = environment.apiUrl + 'landing-page';

  queryFeatured: IPagination = {
    limit: 8,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  queryRelated: IPagination = {
    limit: 8,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  allBicons: any[] = [];

  queryReviews: IPagination = {
    limit: 5,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 1,
    filter: { filterText: '' },
  };

  indexTab = 0;
  errorPage = false;

  previewUrl: any;
  videoUrl: any;

  constructor(
    private route: ActivatedRoute,
    public productsService: ProductService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    public dialog: MatDialog,
    private router: Router,
    private biconService: BiconService,
    public utilsService: UtilsService,
    private cartService: CartService,
    private showToastr: ShowToastrService,
    public _sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private metaService: MetaService,
    private _bottomSheet: MatBottomSheet,
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient,
    public productDataService: ProductDataService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.route.queryParams.subscribe((query) => {
      const productId = +query.productId;
      const stockId = +query.stockId;
      this.productsService.productIdDetails = productId;
      this.isLoading = true;
      this.productsService.getProductById(productId, stockId).subscribe(
        (data) => {
          this.product = data.data;
          this.getProductsByBusiness(this.product.BusinessId);
          this.initStateView();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.utilsService.errorHandle(error);
          this.errorPage = true;
          // this.getFeaturedProducts();
        },
      );
    });
  }

  initStateView() {
    this.indexTab = 0;
    this.allReviews = [];
    this.queryReviews.limit = 5;
    this.queryReviews.offset = 0;
    this.queryReviews.page = 1;
    this.counter = this.product.minSale;
    this.getReviews();
    if (this.product.Images) {
      this.arrayImages = this.product.Images.map((item) => {
        return { image: this.imageUrl + item.image, selected: false };
      });
      this.arrayImages[0].selected = true;
      this.mainImage = this.arrayImages[0];
    }
    this.getRelatedProducts();
    // this.getFeaturedProducts();
    // ////////////////////META///////////////////
    this.metaService.setMeta(
      this.product.name[this.language],
      this.product.shortDescription[this.language],
      this.mainImage?.image,
      environment.meta?.mainPage?.keywords,
    );

    // //////////////////////////////////////////
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });

    // this.biconService.getAllBicons({ offset: 0, limit: 4, order: 'updatedAt' }).subscribe(
    //   (data) => {
    //     this.allBicons = data.data;
    //   },
    //   (error) => {
    //     this.allBicons = [];
    //   },
    // );

    this.getPFDFromStorage();

    this.reviewForm = this.fb.group({
      review: [null, [Validators.required, Validators.maxLength(250), Validators.minLength(10)]],
      rating: [3.5, Validators.required],
    });

    this.allProductsOnMenuToShow = this.searchProductControl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      map((value) => this._filter(value)),
    );

    ///Data to redirect function///
    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.paramsToUrlRedirect = {
      productId: this.route.snapshot.queryParamMap.get('productId'),
      stockId: this.route.snapshot.queryParamMap.get('stockId'),
    };
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  getPFDFromStorage() {
    try {
      const lp = this.localStorageService.getFromStorage(LANDING_PAGE);

      if (!lp) {
        this.getFrontData();
        return;
      }

      if (this.localStorageService.iMostReSearch(lp?.timespan, environment.timeToResearchLandingPageData)) {
        this.getFrontData();
      } else {
        this.setDataOnLandingPage(lp);
      }
    } catch (e) {
      this.getFrontData();
    }
  }

  setDataOnLandingPage(data) {
    this.allBicons = data.bicons || [];
    this.featuredProducts = this.productDataService.featuredProducts;
    this.loadingFeatured = false;
  }

  getFrontData() {
    this.getFrontDataRequest()
      .then((data: any) => {
        const dataResponse = JSON.parse(JSON.stringify(data.data));
        this.setDataOnLandingPage(dataResponse);

        const _response: any = JSON.parse(JSON.stringify(data.data));
        _response.timespan = new Date().getTime();
        this.localStorageService.setOnStorage(LANDING_PAGE, _response);

        const _responseCP: any = {};
        _responseCP.count = JSON.parse(JSON.stringify(_response.countProducts));
        _responseCP.timespan = new Date().getTime();
        this.localStorageService.setOnStorage(PRODUCT_COUNT, _responseCP);
      })
      .catch((error) => {
        this.loadingFeatured = false;
      });
  }

  getFrontDataRequest() {
    return this.httpClient.get(this.url).toPromise();
  }

  onSelectImage(index) {
    this.arrayImages.map((item) => {
      item.selected = false;
    });
    this.arrayImages[index].selected = true;
    this.mainImage = this.arrayImages[index];
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }

  getProductsByBusiness(businessId) {
    this.loadingMenu = true;
    this.productsService.getProductsByBusiness(businessId).subscribe(
      (data: any) => {
        console.log('PRODUCTS ON MENU', data.data);
        this.allProductsOnMenu = data.data.slice();
        const timeOut = setTimeout(() => {
          this.loadingMenu = false;
          clearTimeout(timeOut);
        }, 200);
      },
      (error) => {
        const timeOut = setTimeout(() => {
          this.loadingMenu = false;
          clearTimeout(timeOut);
        }, 200);
      },
    );
  }

  getRelatedProducts() {
    this.loadingRelated = true;
    this.productsService.getRecomendedProduct(this.product.id).subscribe((data: any) => {
      this.relatedProduct = data.data;
      const timeOut = setTimeout(() => {
        this.loadingRelated = false;
        clearTimeout(timeOut);
      }, 800);
    });
  }

  // Add to cart
  public addToCart(product: any, quantity) {
    if (this.loggedInUserService.getLoggedInUser()) {
      if (quantity === 0) {
        return false;
      }
      this.cartService.addToCart(product, Math.max(product.minSale, quantity)).then();
    } else {
      this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    }
  }

  // getFeaturedProducts() {
  //   this.loadingFeatured = true;
  //   this.productsService.getFeaturedProducts(this.queryFeatured).subscribe((data: any) => {
  //     this.featuredProducts = data.data;
  //     const timeOut = setTimeout(() => {
  //       this.loadingFeatured = false;
  //       clearTimeout(timeOut);
  //     }, 800);
  //   });
  // }

  // Add to cart
  public buyNow(product: Product, quantity) {
    if (quantity > 0) {
      try {
        this.cartService.addToCart(product, parseInt(quantity, 10), true).then((carts: Cart[]) => {
          for (let cart of carts) {
            let dataFind = cart.CartItems.find((cartItemx) => cartItemx?.ProductId == product.id);
            if (dataFind != undefined) {
              let cartId = cart?.id;
              this.router.navigate(['/checkout'], { queryParams: { cartId } }).then();
              return;
            }
          }
        });
      } catch (error) {
        console.warn(error);
      }
    }
  }

  public openZoomViewer() {
    // this.dialog.open(ProductZoomComponent, {
    //   data: this.mainImage,
    //   panelClass: 'zoom-dialog',
    // });
    this.showZoom = !this.showZoom;
  }

  // ////////////////////////////////////////////////////////
  onPostReview() {
    let data: any = this.reviewForm.value;
    data.ProductId = this.product.id;
    if (data.id) {
      this.productsService.editReview(data).subscribe((dataRes) => {
        this.showToastr.showSucces('Comentario editado exitósamente', 'Éxito', 3000);
        let index = this.allReviews.findIndex((item) => item.id == dataRes.data.id);
        this.allReviews[index] = dataRes.data;
        this.reviewForm.reset();
      });
    } else {
      this.productsService.createReview(data).subscribe((dataRes) => {
        this.showToastr.showSucces('Comentario creado exitósamente', 'Éxito', 3000);
        this.allReviews.unshift(dataRes.data);
        this.reviewForm.reset();
      });
    }
  }

  getReviews() {
    this.loadingReviews = true;
    this.productsService.getReviews(this.queryReviews, { ProductId: this.product.id }).subscribe(
      (data) => {
        this.allReviews = this.allReviews.concat(data.data.flat());
        this.queryReviews.offset += data.meta.pagination.count;
        this.queryReviews.total = data.meta.pagination.total;
        this.loadingReviews = false;
      },
      (error) => {
        this.loadingReviews = false;
      },
    );
  }

  onGetMorePriviews() {
    this.getReviews();
  }

  onEditReview(review) {
    this.reviewForm = this.fb.group({
      review: [review.review, [Validators.required, Validators.maxLength(250), Validators.minLength(10)]],
      rating: [review.rating, Validators.required],
      id: [review.id],
    });
  }

  onAddtoCartNav() {
    if (this.loggedInUserService.getLoggedInUser()) {
      this.cartService.addToCart(this.product, this.counter);
      this.router.navigate(['/cart']);
    } else {
      this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    }
  }

  onAddtoCompListNav() {
    this.productsService.addToCompare(this.product);
    this.router.navigate(['/pages/compare']);
  }

  onGoToCheckouNav() {
    this.buyNow(this.product, 1);
  }

  onShareProduct() {
    this._bottomSheet.open(SocialMediaComponent, {
      data: {
        product: this.product,
      },
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allProductsOnMenu.filter((option) => option.name.es.toLowerCase().includes(filterValue));
  }
}
