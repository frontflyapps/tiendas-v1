import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { DialogPrescriptionComponent } from '../products/dialog-prescription/dialog-prescription.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit, OnDestroy {

  @Input() products;
  inLoading = false;

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  imageUrl = environment.imageUrl;

  pathToRedirect: any;
  paramsToUrlRedirect: any;
  constructor(
    public utilsService: UtilsService,
    private productService: ProductService,
    public spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public loggedInUserService: LoggedInUserService,
    public translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    public cartService: CartService,
    public currencyService: CurrencyService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';

    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public async onAddToCart(product: any, quantity: number = 1) {
    this.inLoading = true;

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
        this.inLoading = false;
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    }


    // const loggedIn = await this.cartService.addToCartOnProductCard(product, quantity);
    // this.inLoading = false;
    // if (!loggedIn) {
    //   this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    // }
  }

}
