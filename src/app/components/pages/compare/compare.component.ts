import { MetaService } from 'src/app/core/services/meta.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Product } from '../../../modals/product.model';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  public product: Observable<any[]> = of([]);
  public products: any[] = [];

  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public currencyService: CurrencyService,
    public utilsService: UtilsService,
    public loggedInUserService: LoggedInUserService,
    public dialog: MatDialog,
    private router: Router,
    private metaService: MetaService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.metaService.setMeta(
      'Lista de Comparación',
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
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
    if (this.loggedInUserService.getLoggedInUser()) {
      this.cartService.addToCart(product, quantity);
    } else {
      this.redirectToLoginWithOrigin();
    }
  }

  redirectToLoginWithOrigin() {
    const dialogRef = this.dialog.open(ConfirmationDialogFrontComponent, {
      width: '550px',
      data: {
        title: 'Información',
        textHtml: `
        <h4 style="text-transform:none !important; line-height:1.6rem !important;">
          Es necesario estar logueado para adicionar al carrito de compra.
        </h4>
       `,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      this.router
        .navigate(['/my-account'], {
          queryParams: {
            redirectToOriginPage: 'pages/compare',
          },
        })
        .then();
    });
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
