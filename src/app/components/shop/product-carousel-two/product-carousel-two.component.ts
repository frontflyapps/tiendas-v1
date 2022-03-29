import { UtilsService } from './../../../core/services/utils/utils.service';
import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Product } from './../../../modals/product.model';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductDialogComponent } from '../products/product-dialog/product-dialog.component';
import { CartService } from './../../shared/services/cart.service';
import { ProductService } from '../../shared/services/product.service';
import { WishlistService } from './../../shared/services/wishlist.service';
import { CurrencyService } from './../../../core/services/currency/currency.service';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';

@Component({
  selector: 'app-product-carousel-two',
  templateUrl: './product-carousel-two.component.html',
  styleUrls: ['./product-carousel-two.component.scss'],
})
export class ProductCarouselTwoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Input() products: any[] = [];
  @Input() btnColor: any = 'primary';
  @Input() grid = { 480: 1, 740: 2, 960: 2, 1024: 3, 1280: 4 };
  isLoading = false;

  config: SwiperConfigInterface = {};

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  imageUrl = environment.imageUrl;
  isHandset = false;

  constructor(
    private dialog: MatDialog,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    private router: Router,
    public utilsService: UtilsService,
    private cartService: CartService,
    private breakpointObserver: BreakpointObserver,
    private productService: ProductService,
    private wishlistService: WishlistService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
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
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
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
  public addToCart(product: any, quantity: number = 1) {
    if (this.loggedInUserService.getLoggedInUser()) {
      if (product.minSale > 1) {
        const dialogRef = this.dialog.open(ConfirmationDialogFrontComponent, {
          width: '10cm',
          maxWidth: '100vw',
          data: {
            question: `Este producto posee un restricción de mínima cantidad de unidades para poder adquirirlo, desea añadirlo al carrito?`,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cartService.addToCartQuickly(product, product.minSale);
          }
        });
      } else {
        this.cartService.addToCartQuickly(product, product.minSale);
      }
    } else {
      this.cartService.redirectToLoginWithOrigin(this.router.routerState.snapshot.url);
    }
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  // Add to compare
  public addToCompare(product: Product) {
    this.productService.addToCompare(product);
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
}
