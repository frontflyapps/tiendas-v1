import { environment } from '../../../../environments/environment';
import { IPagination } from '../../../core/classes/pagination.class';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/core/services/meta.service';
import { IProductCard } from '../../../core/classes/product-card.class';
import { FRONT_PRODUCT_DATA, LANDING_PAGE, PRODUCT_COUNT } from '../../../core/classes/global.const';
import { LocalStorageService } from '../../../core/services/localStorage/localStorage.service';
import { ProductDataService, ProductService } from '../../shared/services/product.service';
import { GlobalStateOfCookieService } from '../../../core/services/request-cookie-secure/global-state-of-cookie.service';
import { AppService } from '../../../app.service';
import { CartService } from '../../shared/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

export interface ProductInterface {
  name: string;
  value: any[];
}

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.scss'],
})
export class MainHomeComponent implements OnInit, OnDestroy {
  public flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];

  public currency: any;
  public flag: any;
  public loading: boolean = false;

  indexProduct: number;

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  inLoading = false;

  public slides = [{ title: 'Huge sale', subTitle: 'Up to 70%', image: 'assets/images/carousel/bg-slide.jpg' }];

  showStatic = true;

  ////////////////////////////////////////////////////////////////////////////////

  popularProducts: IProductCard[] = [];
  featuredProducts: IProductCard[] = [];
  servicesProducts: any[] = [];
  bestSellersProducts: IProductCard[] = [];
  allProducts: IProductCard[] = [];
  banners: any[] = [];
  loadingPopular = false;
  businessConfig;
  loadingFeatured = false;
  loadingAllProduct = false;
  loadingServices = true;
  loadingBestSellers = true;
  showOnlyTwoProducts = false;
  loadingProducts = false;
  countProducts = 0;

  pathToRedirect: any;
  paramsToUrlRedirect: any;
  sectionProducts: any[] = [];
  arraySectionProducts: any[] = [];

  queryPopular: IPagination = {
    limit: 8,
    offset: 0,
    total: 0,
    order: 'rating',
  };

  queryFeatured: IPagination = {
    limit: 8,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  queryAll: IPagination = {
    limit: 16,
    offset: 0,
    total: 0,
    order: '-name',
  };

  queryBanners: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: '-updatedAt',
  };

  queryBlog: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: '-updatedAt',
  };

  queryServices: IPagination = {
    limit: 3,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  allArticles: any[] = [];
  allBicons: any[] = [];

  imageUrl = environment.imageUrl;
  url = environment.apiUrl + 'landing-page';
  arrayProducts: ProductInterface[] = [];

  visualizationSections: any;

  bigBanner1 = null;
  bigBanner2 = null;

  public applyStyle: boolean;

  /////////////////////////////////////////////////////////////////////////////////

  constructor(
    public utilsService: UtilsService,
    public spinner: NgxSpinnerService,
    private loggedInUserService: LoggedInUserService,
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient,
    private appService: AppService,
    private metaService: MetaService,
    public productDataService: ProductDataService,
    public translateService: TranslateService,
    public cartService: CartService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private globalStateOfCookieService: GlobalStateOfCookieService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.businessConfig = this.localStorageService.getFromStorage('business-config');
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    // this.frontProduct();
    // this.getFrontData();
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });

    // this.productService.updatedSections$

    this.productService.updatedProducts$.subscribe((response) => {
      this.frontProduct();
    });
    this.productService.updatedSectionsProduct$.subscribe((response) => {
      // TODO: CARLITO eliminar esta linea cunado api te envie el id de cada seccion.
      this.arraySectionProducts = [];
      this.sectionProducts = localStorageService.getFromStorage('sections');
      this.visualizationSections = localStorageService.getFromStorage('sectionsIds').data;
      let cont = 0;
      this.sectionProducts.map(item => {

        // TODO: CARLITO tienes que hacer un find en arraySectionProducts para garanbtizar que no se dupliquen las secciones

        if (item.categories) {
          const arr: any[] = item.categories.categories.map((itemId) => item.categories.products.find((itemProduct) => itemProduct.id === itemId));
          this.arraySectionProducts.push(
            {
              name: this.visualizationSections[cont].title,
              value: arr,
              uuid: this.utilsService.generateUuid(),
            });
        } else if (item.businessPromotion) {
          this.arraySectionProducts.push(item.businessPromotion);
        }
        cont++;
      });
    });
    // this.metaService.setMeta(
    //   environment.meta?.mainPage?.title,
    //   environment.meta?.mainPage?.description,
    //   environment.meta?.mainPage?.shareImg,
    //   environment.meta?.mainPage?.keywords,
    // );
    this.applyResolution();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.applyResolution();
  }

  ngOnInit() {
    this.globalStateOfCookieService.getCookieState() ? this.initComponent() : this.setSubscriptionToCookie();
    // this.frontProduct();
  }

  frontProduct() {
    if (this.arrayProducts.length === 0) {
      // this.productService.updatedProducts$.subscribe((response) => {
      if (this.businessConfig?.frontDataProduct === 'normal') {
        this.getDataProducts();
      } else if (this.businessConfig?.frontDataProduct === 'category') {
        this.getCategoriesProducts();
      } else {
        this.getCategoriesProducts();
      }
      // });
    }
  }

  initComponent() {
    this.loadingAllProduct = true;
    this.loadingPopular = true;
    this.loadingFeatured = true;
    this.loadingServices = true;
    this.loadingBestSellers = true;

    this.getPFDFromStorage();
    this.appService.$businessConfig.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.businessConfig = data;
      // console.log('************', this.businessConfig);
      this.getDataProducts();
    });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });
  }

  setSubscriptionToCookie() {
    this.globalStateOfCookieService.stateOfCookie$.pipe(takeUntil(this._unsubscribeAll)).subscribe((thereIsCookie) => {
      if (thereIsCookie) {
        this.initComponent();
      }
    });
  }

  identify(index, item) {
    return item.uuid;
  }

  getSections() {

  }

  getCategoriesProducts() {
    const pfd = this.localStorageService.getFromStorage(FRONT_PRODUCT_DATA);
    // console.log(pfd);
    if (pfd) {
      Object.entries(pfd).sort(() => Math.random() - 0.5);
      Object.entries(pfd?.categories).forEach(item => {
        // @ts-ignore
        const arr: any[] = item[1].map((itemId) => pfd.products.find((itemProduct) => itemProduct.id === itemId));
        this.arrayProducts.push(
          {
            name: item[0],
            value: arr,
          });
      });
    } else {
      // Aqui es donde entra cuando la peticion front-data-product no ha respondido y en el local storage no hay valor
      // de productos
      // console.warn('No hay productos');
    }

  }

  public async onAddToCart(product: any, quantity: number = 1) {
    this.inLoading = true;
    const loggedIn = await this.cartService.addToCartOnProductCard(product, quantity);
    this.inLoading = false;
    if (!loggedIn) {
      this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    }
  }

  getProducts() {
    this.productService.getProduct.next('');
  }

  setValuesFromResponse(response) {
    this.productDataService.popularProducts = UtilsService.getAnArrayFromIdsAndArray(
      response.products,
      response.rating,
    );
    this.productDataService.featuredProducts = UtilsService.getAnArrayFromIdsAndArray(
      response.products,
      response.isFeatured,
    );
    this.productDataService.bestSellerProducts = UtilsService.getAnArrayFromIdsAndArray(
      response.products,
      response.bestSell,
    );
    this.productDataService.allProducts = UtilsService.getAnArrayFromIdsAndArray(
      response.products,
      response.lastCreated,
    );
  }

  getDataProducts() {
    try {
      const pfd = this.localStorageService.getFromStorage(FRONT_PRODUCT_DATA);
      if (!pfd) {
        this.getProducts();
        return;
      }

      if (this.localStorageService.iMostReSearch(pfd?.timespan, environment.timeToResearchProductData)) {
        this.getProducts();
      } else {
        this.setValuesFromResponse(pfd);
      }
    } catch (e) {
    }
    this.allProducts = this.productDataService.allProducts;
    this.popularProducts = this.productDataService.popularProducts;
    this.featuredProducts = this.productDataService.featuredProducts;
    this.bestSellersProducts = this.productDataService.bestSellerProducts;
  }

  //
  // getDataProductsTest() {
  //   try {
  //     const pfd = this.localStorageService.getFromStorage(FRONT_PRODUCT_DATA);
  //     if (!pfd) {
  //       this.getProducts();
  //       return;
  //     }
  //     this.setValuesFromResponse(pfd);
  //   } catch (e) {
  //   }
  //   this.allProducts = this.productDataService.allProducts;
  //   this.popularProducts = this.productDataService.popularProducts;
  //   this.featuredProducts = this.productDataService.featuredProducts;
  //   this.bestSellersProducts = this.productDataService.bestSellerProducts;
  // }

  loadProducts() {
    console.log('load');
    if (!this.loadingProducts) {
      this.loadingProducts = true;
      this.productService.getSectionsIds().subscribe(data => {
        setTimeout(() => {
          this.loadingProducts = false;
        }, 500);
      });
    }
    // this.arraySectionProducts = this.arraySectionProducts.concat(this.arraySectionProducts);
    // this.visualizationSections = this.visualizationSections.concat(this.visualizationSections);
  }

  getPFDFromStorage() {
    try {
      const lp = this.localStorageService.getFromStorage(FRONT_PRODUCT_DATA);

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

  setUrlPathOnImages(data) {
    this.slides = [];
    this.slides = data.carrusels.map((item) => {
      item.image = this.imageUrl + item.image;
      item.imageXs = this.imageUrl + item.imageXs;
      return item;
    });
  }

  setDataOnLandingPage(data) {
    this.setUrlPathOnImages(data);

    this.showStatic = false;
    this.allBicons = data.bicons || [];
    this.showOnlyTwoProducts = this.allProducts.length <= 2;
    this.banners = data.banner;

    this.allArticles = data.blogRecents;
    this.countProducts = data.countProducts;
    this.servicesProducts = data.ourServices;
    this.bigBanner1 = data.promotions.filter((promotion) => promotion.type === 'bigBannerPromo1');
    this.bigBanner2 = data.promotions.filter((promotion) => promotion.type === 'bigBannerPromo2');
    this.loadingServices = false;

    this.getDataProducts();

    this.loadingPopular = false;
    this.loadingFeatured = false;
    this.loadingAllProduct = false;
    this.loadingBestSellers = false;
  }

  getFrontData() {
    this.getFrontDataRequest()
      .then((data: any) => {
        // if (!this.localStorageService.getFromStorage(FRONT_PRODUCT_DATA)) {
        //   console.warn('asdadasdasdasd');
        //   this.spinner.show();
        // this.loading = true;
        // this.getDataProducts();
        // this.productService.updatedProducts$.subscribe((response) => {
        // console.log(this.arrayProducts.length);
        this.frontProduct();

        // });
        // this.productService.getFrontProductsData().subscribe(item => {
        //   this.loading = false;
        //   console.log(item);
        //   this.spinner.hide();
        // });
        // this.spinner.hide();
        // }
        // if (!this.businessConfig) {
        //   this.loading = true;
        //   this.appService.getBusinessConfig().subscribe(item => {
        //     this.loading = false;
        //     this.businessConfig = item.data;
        //     localStorage.setItem('business-config', JSON.stringify(item.data));
        //     // this.productService.updatedProducts$.subscribe((response) => {
        //     console.error(this.arrayProducts.length);
        //     console.error(this.businessConfig);
        //     if (this.arrayProducts.length === 0) {
        //       if (this.businessConfig?.frontDataProduct === 'normal') {
        //         this.getDataProducts();
        //       } else if (this.businessConfig?.frontDataProduct === 'category') {
        //         this.getCategoriesProducts();
        //       } else {
        //         this.getCategoriesProducts();
        //       }
        //     }
        //     });
        //   // });
        // }
        this.loading = false;
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
        this.showStatic = true;
        this.loadingAllProduct = false;
        this.loadingPopular = false;
        this.loadingFeatured = false;
        this.loadingServices = false;
      });
  }

  getFrontDataRequest() {
    return this.httpClient.get(this.url).toPromise();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // getBestSellers() {
  //   return this.httpClient.get(environment.apiUrl + 'product/best-seller').toPromise();
  // }

  private applyResolution() {
    const innerWidth = window.innerWidth;
    this.applyStyle = innerWidth <= 600;
  }
}
