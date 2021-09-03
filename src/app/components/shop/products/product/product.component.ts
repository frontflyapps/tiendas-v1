import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { ProductService } from '../../../shared/services/product.service';
import { WishlistService } from '../../../shared/services/wishlist.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from '../../../../modals/product.model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { ConfirmationDialogFrontComponent } from 'src/app/components/shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
  @Input() product: any;
  inLoading = false;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  imageUrl = environment.imageUrl;
  isHandset = false;
  language = null;

  constructor(
    private cartService: CartService,
    public productsService: ProductService,
    private wishlistService: WishlistService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    public utilsService: UtilsService,
    private dialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
  ) {
    this._unsubscribeAll = new Subject<any>();
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

  // Add to cart
  public addToCart(product: any, quantity: number = 1) {
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
          this.cartService
            .addToCart(product, product.minSale)
            .then((data) => {
              this.inLoading = false;
            })
            .catch((error) => {
              this.inLoading = false;
            });
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
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  // Add to compare
  public addToCompare(product: Product) {
    this.productsService.addToCompare(product);
  }

  public openProductDialog(product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/products', result.id, result.name]);
      }
    });
  }
}
