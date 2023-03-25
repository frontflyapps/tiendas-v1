import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { ProductService } from '../../shared/services/product.service';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
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
    console.log(this.products);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public async onAddToCart(product: any, quantity: number = 1) {
    this.inLoading = true;
    const loggedIn = await this.cartService.addToCartOnProductCard(product, quantity);
    this.inLoading = false;
    if (!loggedIn) {
      this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
    }
  }

}
