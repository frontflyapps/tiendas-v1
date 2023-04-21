import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../modals/product.model';
import { CartService } from '../../../shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { DialogPrescriptionComponent } from '../dialog-prescription/dialog-prescription.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  public products: any[] = [];
  public counter = 1;
  public variantImage: any = '';
  public selectedColor: any = '';
  public selectedSize: any = '';

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  imageUrl = environment.imageUrl;

  pathToRedirect: any;
  paramsToUrlRedirect: any;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public spinner: NgxSpinnerService,
    public productsService: ProductService,
    public utilsServ: UtilsService,
    public currencyService: CurrencyService,
    private cartService: CartService,
    private loggedInUserService: LoggedInUserService,
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public product: any,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.counter = product.minSale;
    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });
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

  public addToCart(product: Product, quantity) {
    if (quantity == 0) {
      return false;
    }
    if (product.typeAddCart === 'glasses') {
      if (this.loggedInUserService.getLoggedInUser()) {
        const dialogRef = this.dialog.open(DialogPrescriptionComponent, {
          width: 'auto',
          maxWidth: '100vw',
          height: 'auto',
          maxHeight: '100vw',
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
    } else {
      if (this.loggedInUserService.getLoggedInUser()) {
        if (quantity === 0) {
          return false;
        }
        this.cartService.addToCart(product, parseInt(quantity)).then();
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    }


  }

  public close(): void {
    this.dialogRef.close();
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }

  // Add to cart
  public buyNow() {
    this.router.navigate(['/product', this.product.id]);
    this.close();
  }
}
