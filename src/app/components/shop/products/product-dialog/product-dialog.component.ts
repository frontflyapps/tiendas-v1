import { Component, Inject, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../modals/product.model';
import { CartService } from '../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CurrencyService } from '../../../../core/services/currency/currency.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  public products: any[] = [];
  public counter = 1;
  public variantImage: any = '';
  public selectedColor: any = '';
  public selectedSize: any = '';

  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  imageUrl = environment.imageUrl;

  constructor(
    private router: Router,
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
    this.cartService.addToCart(product, parseInt(quantity));


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
