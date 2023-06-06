import { MetaService } from './../../../core/services/meta.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Product } from './../../../modals/product.model';
import { CartService } from '../../shared/services/cart.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogPrescriptionComponent } from '../../shop/products/dialog-prescription/dialog-prescription.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  public product: Observable<Product[]> = of([]);
  wishlistItems: Product[] = [];
  pathToRedirect: any;
  paramsToUrlRedirect: any;
  isSmallDevice = false;
  _unsubscribeAll: Subject<any>;

  constructor(
    private cartService: CartService,
    private loggedInUserService: LoggedInUserService,
    private wishlistService: WishlistService,
    private router: Router,
    private metaService: MetaService,
    public spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {
    this.product = this.wishlistService.getProducts();
    this.product.subscribe((products) => {
      this.wishlistItems = products;
    });

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
    // this.metaService.setMeta(
    //   'Lista de Deseos',
    //   environment.meta?.mainPage?.description,
    //   environment.meta?.mainPage?.shareImg,
    //   environment.meta?.mainPage?.keywords,
    // );
  }

  ngOnInit() {}

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
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
  }

  // Remove from wishlist
  public removeItem(product: Product) {
    this.wishlistService.removeFromWishlist(product);
  }
}
