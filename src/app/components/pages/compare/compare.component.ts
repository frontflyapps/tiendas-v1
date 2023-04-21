import { MetaService } from 'src/app/core/services/meta.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Product } from '../../../modals/product.model';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogPrescriptionComponent } from '../../shop/products/dialog-prescription/dialog-prescription.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit, OnDestroy {
  public product: Observable<any[]> = of([]);
  public products: any[] = [];

  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;

  ratingConfig = {
    readOnly: true
  };
  pathToRedirect: any;
  paramsToUrlRedirect: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public dialog: MatDialog,
    public spinner: NgxSpinnerService,
    public currencyService: CurrencyService,
    public utilsService: UtilsService,
    private router: Router,
    public loggedInUserService: LoggedInUserService,
    private metaService: MetaService,
    public route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';

    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });
    // this.metaService.setMeta(
    //   'Lista de Comparación',
    //   environment.meta?.mainPage?.description,
    //   environment.meta?.mainPage?.shareImg,
    //   environment.meta?.mainPage?.keywords,
    // );
  }

  ngOnInit() {
    this.product = this.productService.getComapreProducts();
    this.product.subscribe((products) => (this.products = products));

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
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
        this.cartService.addToCart(product, quantity).then();
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // Remove from compare list
  public removeItem(product: Product) {
    this.productService.removeFromCompare(product);
  }
}
