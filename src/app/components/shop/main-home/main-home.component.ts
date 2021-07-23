import { environment } from './../../../../environments/environment';
import { IPagination } from './../../../core/classes/pagination.class';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartItem } from './../../../modals/cart-item';
import { CartService } from '../../shared/services/cart.service';
import { Subject } from 'rxjs';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { takeUntil, take, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/core/services/meta.service';

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

  popularProducts: any[] = [];
  featuredProducts: any[] = [];
  servicesProducts: any[] = [];
  bestSellersProducts: any[] = [];
  allProducts: any[] = [];
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

  /////////////////////////////////////////////////////////////////////////////////

  constructor(
    public utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
    private httpClient: HttpClient,
    private metaService: MetaService,
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
  }

  ngOnInit() {
    this.loadingAllProduct = true;
    this.loadingPopular = true;
    this.loadingFeatured = true;
    this.loadingServices = true;
    this.loadingBestSellers = true;
    this.getFrontData()
      .then((data: any) => {
        this.slides = data.data.carrusels.map((item) => {
          item.image = this.imageUrl + item.image;
          item.imageXs = this.imageUrl + item.imageXs;
          return item;
        });
        this.showStatic = false;
        this.allBicons = data.data.bicons || [];
        this.allProducts = data.data.recentProducts;
        this.showOnlyTwoProducts = this.allProducts.length <= 2 ? true : false;
        this.loadingAllProduct = false;
        this.banners = data.data.banner;
        this.popularProducts = data.data.popularProducts;
        this.loadingPopular = false;
        this.featuredProducts = data.data.featureedProducts;
        this.loadingFeatured = false;
        this.allArticles = data.data.blogRecents;
        this.countProducts = data.data.countProducts;
        this.servicesProducts = data.data.ourServices;
        this.bigBanner1 = data.data.bigBanner1;
        this.bigBanner2 = data.data.bigBanner2;
        this.loadingServices = false;
      })
      .catch((error) => {
        this.showStatic = true;
        this.loadingAllProduct = false;
        this.loadingPopular = false;
        this.loadingFeatured = false;
        this.loadingServices = false;
      });

    this.getBestSellers()
      .then((data: any) => {
        this.bestSellersProducts = data.data;
        this.loadingBestSellers = false;
      })
      .catch((e) => {
        this.loadingBestSellers = false;
      });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });
  }

  getFrontData() {
    return this.httpClient.get(this.url).toPromise();
  }

  getBestSellers() {
    return this.httpClient.get(environment.apiUrl + 'product/best-seller').toPromise();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
