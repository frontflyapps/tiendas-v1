import { MetaService } from 'src/app/core/services/meta.service';
import { ShowToastrService } from '../../../../core/services/show-toastr/show-toastr.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../shared/services/cart.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Cart } from 'src/app/modals/cart-item';
import { BiconService } from 'src/app/core/services/bicon/bicon.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SocialMediaComponent } from './social-media/social-media.component';
import { LANDING_PAGE, PRODUCT_COUNT } from '../../../../core/classes/global.const';
import { LocalStorageService } from '../../../../core/services/localStorage/localStorage.service';
import { ConfirmationDialogFrontComponent } from '../../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { DialogPrescriptionComponent } from '../dialog-prescription/dialog-prescription.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = true;
  product: any = {};
  products: any[] = [];
  relatedProduct: any;
  totalProducts: number;
  limitSearch = environment.limitSearch;
  query: IPagination = {
    limit: this.limitSearch,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 0,
  };
  loadingProducts = false;
  supplementArray: any;
  featuredProducts: any[] = [];
  imageUrl = environment.imageUrl;
  arrayImages: any[] = [];
  mainImage = null;
  changeImage = false;
  language: any;
  _unsubscribeAll: Subject<any>;
  public config: SwiperConfigInterface = {};
  public configVariants: SwiperConfigInterface = {};
  loggedInUser: any = null;
  reviewForm: UntypedFormGroup;
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

  searchProductControl = new UntypedFormControl();

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

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
  };
  private paginationVariants: SwiperPaginationInterface = {
    clickable: true,
  };

  indexTab = 0;
  errorPage = false;

  previewUrl: any;
  videoUrl: any;
  isSmallDevice: boolean = false;

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
    private fb: UntypedFormBuilder,
    // private metaService: MetaService,
    private _bottomSheet: MatBottomSheet,
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient,
    public productDataService: ProductDataService,
    public spinner: NgxSpinnerService,
    private meta: Meta,
    private breakpointObserver: BreakpointObserver,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.breakpointObserver
      .observe([
        Breakpoints.Medium,
        Breakpoints.Handset,
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Tablet
      ])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.isSmallDevice = data.matches;
      });

    this.route.queryParams.subscribe((query) => {
      const productId = query.productId;
      console.log(window.location.href);
      const stockId = query.stockId;
      this.productsService.productIdDetails = productId;
      this.isLoading = true;
      this.productsService.getProductById(productId, stockId).subscribe(
        (data) => {
          this.product = data.data;
          console.log(this.product);
          this.getProductsByBusiness(this.product?.BusinessId, this.query);
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

  checkMinMaxValues(event, product): boolean {
    console.log(event);
    console.log(product);
    const currentAmountOnInput = +event.target.value;
    if ((currentAmountOnInput < product?.minSale) || (currentAmountOnInput > product?.maxSale)) {
      this.showToastr.showInfo(
        `Este producto tiene un mínimo de cantidad a vender de ${product?.minSale} y un máximo de ${product?.maxSale}`,
        'Atención',
        5000,
      );
      return false;
    } else {
      return true;
    }
  }

  initStateView() {
    this.indexTab = 0;
    this.allReviews = [];
    this.queryReviews.limit = 5;
    this.queryReviews.offset = 0;
    this.queryReviews.page = 1;
    this.counter = this.product.minSale;
    this.getReviews();
    if (this.product?.Images) {
      this.arrayImages = this.product?.Images.map((item) => {
        return { image: this.imageUrl + item.image, selected: false };
      });
      this.arrayImages[0].selected = true;
      this.mainImage = this.arrayImages[0];
    }
    this.getRelatedProducts();
    // this.getFeaturedProducts();
    // ////////////////////META///////////////////
    this.meta.updateTag({name: 'title', content: this.product?.name?.es});
    this.meta.updateTag({name: 'description', content: this.product?.description?.es});
    this.meta.updateTag({name: 'keywords', content: this.product?.Business?.name});

    this.meta.updateTag({property: 'og:url', content: window.location.href});
    this.meta.updateTag({property: 'og:site_name', content: this.product?.name?.es});
    this.meta.updateTag({property: 'og:image', itemprop: 'image primaryImageOfPage', content: this.product?.sharedImage});

    this.meta.updateTag({name: 'twitter:domain', content: window.location.href});
    this.meta.updateTag({name: 'twitter:title', itemprop: 'name', content: this.product?.name?.es});
    this.meta.updateTag({name: 'og:title', itemprop: 'name', content: this.product?.name?.es});
    this.meta.updateTag({name: 'twitter:description', content: this.product?.Business?.name});
    this.meta.updateTag({name: 'og:description', itemprop: 'description', content: this.product?.Business?.name});
    this.meta.updateTag({name: 'twitter:image', itemprop: 'image primaryImageOfPage', content: this.product?.sharedImage});

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

    /// Data to redirect function///
    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });
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

  loadProducts() {
    if (!this.loadingProducts) {
      if (this.query.offset <= this.totalProducts) {
        this.loadingProducts = true;
        this.query.page = this.query.page + 1;
        this.query.offset = this.query.limit * this.query.page;
        this.getProductsByBusiness(this.product?.BusinessId, this.query);
      }
    }
  }

  getProductsByBusiness(businessId, query?: any) {
    this.loadingMenu = true;
    this.productsService.getProductsByBusiness(businessId, query).subscribe(
      (data: any) => {
        console.log('PRODUCTS ON MENU', data.data);
        this.totalProducts = data?.meta?.pagination?.total;
        let temp = this.allProductsOnMenu;
        console.log(temp);
        temp = temp.concat(data.data.slice());

        console.log(temp);
        this.allProductsOnMenu = temp;
        const timeOut = setTimeout(() => {
          this.loadingMenu = false;
          this.loadingProducts = false;
          clearTimeout(timeOut);
        }, 200);
      },
      (error) => {
        const timeOut = setTimeout(() => {
          this.loadingMenu = false;
          this.loadingProducts = false;
          clearTimeout(timeOut);
        }, 200);
      },
    );
  }

  getRelatedProducts() {
    this.loadingRelated = true;
    this.productsService.getNewRecomendedProduct(this.product.id, 'recommended').subscribe((data: any) => {
      this.relatedProduct = data.data;
      console.log(this.relatedProduct);
      this.loadingRelated = false;
    //   const timeOut = setTimeout(() => {
    //     this.loadingRelated = false;
    //     clearTimeout(timeOut);
    //   }, 800);
    });

  }

  ngAfterViewInit(): void {
    this.initConfig();
  }

  goProduct(product) {
    console.log(product);
    // const params = new URLSearchParams(productId: product?.Product?.id, stockId: product?.Product?.Stock?.id, name: item?.name?.es, product: item?.sharedImage);
    const params = '/product' + '?' + 'productId=' + product?.ProductId + 'stockId=' + product?.RecomendedProduct.Stocks[0]?.uuid +
    'name=' + product?.RecomendedProduct.name?.es + 'sharedImage=' + product?.RecomendedProduct.sharedImage;
    console.log(params);
    // window.location.href = params;

  //   [queryParams]="{ productId: item?.Product?.id, stockId: item?.Product?.Stock?.id,
  //   name: item?.name?.es,
  //     sharedImage: item?.sharedImage }"
  // [routerLink]="['/product']"
  }

  initConfig() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: false,
      effect: 'fade',
    };
    this.configVariants = {
      slidesPerView: 7,
      spaceBetween: 20,
      keyboard: true,
      navigation: true,
      pagination: this.paginationVariants,
      grabCursor: true,
      loop: false,
      preloadImages: true,
      lazy: true,
      autoplay: false,
      effect: 'slide',
    };
  }

  addLenses(product: any, quantity) {
    if (this.loggedInUserService.getLoggedInUser()) {
      const dialogRef = this.dialog.open(DialogPrescriptionComponent, {
        disableClose: false,
        hasBackdrop: true,
        width: this.isSmallDevice ? '100vw' : '20vw',
        maxWidth: this.isSmallDevice ? '100vw' : '50vw',
        height: this.isSmallDevice ? '100vh' : '50vh',
        maxHeight: this.isSmallDevice ? '100vh' : '50vh',
        data: {
          product: product,
          quantity: quantity,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.spinner.hide();
          //   this.router.navigate(['/products', result.id, result.name]).then();
        } else {
          // this.showToastr.showError('No se pudo añadir al carrito');
          this.spinner.hide();
        }
      });
    } else {
      this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    }
  }

  // Add to cart
  public addToCart(product: any, quantity) {
    console.log('entro aki');
    console.log(product);
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
    console.log(product);
    console.log(quantity);
    if (quantity > 0) {
      try {
        this.cartService.addToCart(product, parseInt(quantity, 10), true).then((carts: Cart[]) => {
          console.log(carts);
          for (let cart of carts) {
            let dataFind = cart.CartItems.find((cartItemx) => cartItemx?.ProductId == product.id);
            if (dataFind != undefined) {
              let cartId = cart?.id;
              let BusinessId = cart.BusinessId;
              let cartIds = cart?.CartItems ? cart?.CartItems.map((i) => i.id) : cart.CartItems.map((i) => i.id);
              console.log(cartIds);
              this.router.navigate(['/checkout'], { queryParams: { cartId, cartIds, BusinessId } }).then();
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
    this.productsService.getReviews(this.queryReviews, { ProductId: this.product?.id }).subscribe(
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


      // if (this.product.typeAddCart === 'glasses') {
      //   if (this.loggedInUserService.getLoggedInUser()) {
      //     const dialogRef = this.dialog.open(DialogPrescriptionComponent, {
      //       width: this.isSmallDevice ? '100vw' : '50rem',
      //       maxWidth: this.isSmallDevice ? '100vw' : '50rem',
      //       height: this.isSmallDevice ? '100vh' : '50rem',
      //       maxHeight: this.isSmallDevice ? '100vh' : '50rem',
      //       data: {
      //         product: this.product,
      //         quantity: this.counter,
      //       },
      //     });
      //     dialogRef.afterClosed().subscribe((result) => {
      //       if (result) {
      //         this.spinner.hide();
      //         //   this.router.navigate(['/products', result.id, result.name]).then();
      //       } else {
      //         // this.showToastr.showError('No se pudo añadir al carrito');
      //         this.spinner.hide();
      //       }
      //     });
      //   } else {
      //     this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      //   }
      // } else {
        if (this.loggedInUserService.getLoggedInUser()) {
          this.cartService.addToCart(this.product, this.counter).then();
        } else {
          this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
        }
      // }
      this.router.navigate(['/cart']);
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
