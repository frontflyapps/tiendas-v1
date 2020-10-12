import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { UtilsService } from './../../../core/services/utils/utils.service';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss'],
})
export class MainCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  _unsubscribeAll: Subject<any>;
  @Input() set slides(values: any[]) {
    this._slides = [...values];
    // if (this._slides && this._slides.length) {
    //   setTimeout(() => {
    //     let element = document.getElementById('my-main-slider');
    //     if (element.classList.contains('loader')) {
    //       element.classList.toggle('loader');
    //     }
    //   }, 150);
    // }
  }

  _slides: any[] = [];
  language: any;

  public config: SwiperConfigInterface = {};

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
  };

  show = false;

  constructor(
    private translate: TranslateService,
    private loggedInUserService: LoggedInUserService,
    public utilsService: UtilsService,
  ) {
    this._unsubscribeAll = new Subject();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  ngAfterViewInit(): void {
    this.initConfig();
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
      // autoplay: {
      //   delay: 4000,
      //   disableOnInteraction: false,
      // },
      speed: 500,
      effect: 'slide',
    };
  }
}
