import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { CartService } from '../../services/cart.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ConfirmationDialogFrontComponent } from '../../confirmation-dialog-front/confirmation-dialog-front.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogPrescriptionComponent } from '../../../shop/products/dialog-prescription/dialog-prescription.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-footer-product-card',
  templateUrl: './footer-product-card.component.html',
  styleUrls: ['./footer-product-card.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterProductCardComponent implements OnDestroy {
  _unsubscribeAll: Subject<any> = new Subject<any>();

  public imageUrl = environment.imageUrl;
  loggedInUser: any = null;
  pathToRedirect: any;
  paramsToUrlRedirect: any;
  inLoading = false;

  @Input() Products: any[] = [];

  @Input() language = 'es';

  constructor(
    public cdr: ChangeDetectorRef,
    public currencyService: CurrencyService,
    public spinner: NgxSpinnerService,
    public cartService: CartService,
    private loggedInUserService: LoggedInUserService,
    public translate: TranslateService,
    public utilsService: UtilsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((dataLogged: any) => {
      setTimeout((t) => {
        this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      }, 0);
    });

    this.pathToRedirect = this.route.snapshot.routeConfig.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
    this._unsubscribeAll.unsubscribe();
  }

  public addToCart(product: any, quantity: number = 1) {
    if (this.loggedInUserService.getLoggedInUser()) {
      this.inLoading = true;
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
            if (product.typeAddCart === 'glasses') {
              if (this.loggedInUserService.getLoggedInUser()) {
                const dialogRefe = this.dialog.open(DialogPrescriptionComponent, {
                  width: 'auto',
                  maxWidth: '100vw',
                  height: 'auto',
                  maxHeight: '100vw',
                  data: {
                    product: product,
                    quantity: quantity,
                  },
                });
                dialogRefe.afterClosed().subscribe((result) => {
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
                this.cartService.addToCart(product, product.minSale).then();
              } else {
                this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
              }
            }
          }
        });
      } else {
        this.cartService
          .addToCart(product, product.minSale)
          .then((data) => {
            this.inLoading = false;
          })
          .catch((error) => {
            this.inLoading = false;
          });
      }
    } else {
      this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    }
  }
}
