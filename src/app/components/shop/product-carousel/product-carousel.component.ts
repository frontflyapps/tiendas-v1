import { WishlistService } from '../../shared/services/wishlist.service';

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Product } from '../../../modals/product.model';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDialogComponent } from '../products/product-dialog/product-dialog.component';
import { CartService } from '../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { DialogPrescriptionComponent } from '../products/dialog-prescription/dialog-prescription.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss'],
})
export class ProductCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Input() products: any[] = [];
  @Input() btnColor: any = 'primary';
  @Input() grid = { 480: 1, 740: 2, 960: 2, 1024: 3, 1280: 4 };
  @Input() showBig = false;
  inLoading = false;
  showLocationSpan = environment.showLocation;
  typesProducts = [
    { id: 'physical', name: { es: 'Físico', en: 'Physical' } },
    { id: 'digital', name: { es: 'Digital', en: 'Digital' } },
    { id: 'service', name: { es: 'Servicio', en: 'Service' } },
  ];
  config: SwiperConfigInterface = {};

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  imageUrl = environment.imageUrl;
  isHandset = false;

  pathToRedirect: any;
  paramsToUrlRedirect: any;
  isSmallDevice = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private wishlistService: WishlistService,
    public utilsService: UtilsService,
    public spinner: NgxSpinnerService,
    public cartService: CartService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';

    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });

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
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.isHandset = data.matches;
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  ngAfterViewInit(): void {
    this.config = {
      observer: true,
      slidesPerView: 'auto',
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      slidesPerGroup: 1,
      breakpoints: {
        480: {
          slidesPerView: 'auto',
          slidesPerGroup: 1,
        },
        740: {
          slidesPerView: 'auto',
        },
        // 960: {
        //   slidesPerView: 3,
        // },
        // 1024: {
        //   slidesPerView: 3,
        // },
        // 1280: {
        //   slidesPerView: 4,
        // },
      },
    };
  }

  public openProductDialog(product) {
    this.productService.getProductById(product.id, product?.Stock?.id).subscribe((data) => {
      const dialogRef = this.dialog.open(ProductDialogComponent, {
        data: data.data,
        panelClass: 'product-dialog',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.router.navigate(['/products', result.id, result.name]).then();
        }
      });
    });
  }

  // Add to cart
  public async onAddToCart(product: any, quantity: number = 1) {
    this.inLoading = true;

    // if (product.typeAddCart === 'glasses') {
    //   if (this.loggedInUserService.getLoggedInUser()) {
    //     const dialogRef = this.dialog.open(DialogPrescriptionComponent, {
    //       width: this.isSmallDevice ? '100vw' : '50rem',
    //       maxWidth: this.isSmallDevice ? '100vw' : '50rem',
    //       height: this.isSmallDevice ? '100vh' : '50rem',
    //       maxHeight: this.isSmallDevice ? '100vh' : '50rem',
    //       data: {
    //         product: product,
    //         quantity: quantity,
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
        if (quantity === 0) {
          return false;
        }
        this.cartService.addToCart(product, quantity).then();
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    // }

    // const loggedIn = await this.cartService.addToCartOnProductCard(product, quantity);
    this.inLoading = false;
    // if (!loggedIn) {
    //   this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    // }
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  // Add to compare
  public addToCompare(product: Product) {
    this.productService.addToCompare(product);
  }
}
