import { environment } from '../../../../environments/environment';
import { IPagination } from '../../../core/classes/pagination.class';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
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

  indexProduct: number;

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;

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
  loadingFeatured = false;
  loadingAllProduct = false;
  loadingServices = true;
  loadingBestSellers = true;
  showOnlyTwoProducts = false;
  countProducts = 0;

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

  bigBanner1 = null;
  bigBanner2 = null;

  public applyStyle: boolean;

  /////////////////////////////////////////////////////////////////////////////////

  constructor(
    public utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient,
    private metaService: MetaService,
    public productDataService: ProductDataService,
    private globalStateOfCookieService: GlobalStateOfCookieService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.metaService.setMeta(
      environment.meta?.mainPage?.title,
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
    this.applyResolution();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.applyResolution();
  }

  ngOnInit() {
    this.globalStateOfCookieService.getCookieState() ? this.initComponent() : this.setSubscriptionToCookie();

    // this.getBestSellers()
    //   .then((data: any) => {
    //     this.bestSellersProducts = data.data;
    //     this.loadingBestSellers = false;
    //   })
    //   .catch((e) => {
    //     this.loadingBestSellers = false;
    //   });
  }

  initComponent() {
    this.loadingAllProduct = true;
    this.loadingPopular = true;
    this.loadingFeatured = true;
    this.loadingServices = true;
    this.loadingBestSellers = true;

    this.getPFDFromStorage();

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

    this.allProducts = this.productDataService.allProducts;
    this.popularProducts = this.productDataService.popularProducts;
    this.featuredProducts = this.productDataService.featuredProducts;
    this.bestSellersProducts = this.productDataService.bestSellerProducts;

    this.loadingPopular = false;
    this.loadingFeatured = false;
    this.loadingAllProduct = false;
    this.loadingBestSellers = false;
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
