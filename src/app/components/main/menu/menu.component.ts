import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { Subject } from 'rxjs';
import { CartService } from '../../shared/services/cart.service';
import { TranslateService } from '@ngx-translate/core';
import { IPagination } from 'src/app/core/classes/pagination.class';
import { MyOrdersService } from '../../my-orders/service/my-orders.service';
import { GlobalStateOfCookieService } from '../../../core/services/request-cookie-secure/global-state-of-cookie.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  navItems: any[] = [];
  loggedInUser: any = null;
  _unsubscribeAll: Subject<any>;
  shoppingCartItems: any[] = [];
  language;
  ordersPayment: any[] = [];
  categories: any[] = [];
  query: IPagination = {
    limit: 20,
    offset: 0,
    order: '-createdAt',
    total: 0,
  };

  constructor(
    public navigationService: NavigationService,
    private cartService: CartService,
    private loggedInUserService: LoggedInUserService,
    public utilsSer: UtilsService,
    public translate: TranslateService,
    private ordersService: MyOrdersService,
    private globalStateOfCookieService: GlobalStateOfCookieService,
  ) {
    this.navItems = navigationService.getNavItems();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this._unsubscribeAll = new Subject();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  @Input() set _categories(value) {
    this.categories = [...value];
  }

  ngOnInit() {
    this.globalStateOfCookieService.getCookieState()
      ? this.initComponent()
      : this.setSubscriptionToCookie();
  }

  initComponent() {
    if (this.loggedInUser) {
      this.getOrdersPayment();
    }
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (!this.loggedInUser) {
        this.shoppingCartItems = [];
        this.ordersPayment = [];
      } else {
        this.getOrdersPayment();
      }
    });

    this.shoppingCartItems = this.cartService.getShoppingCars();

    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.shoppingCartItems = this.cartService.getShoppingCars();
    });

    this.ordersService.$orderItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      if (this.loggedInUser) {
        this.getOrdersPayment();
      }
    });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  setSubscriptionToCookie() {
    this.globalStateOfCookieService.stateOfCookie$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((thereIsCookie) => {
        if (thereIsCookie) {
          this.initComponent();
        }
      });
  }

  openMegaMenu() {
    let pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function(el) {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains('mega-menu')) {
          el.classList.add('mega-menu-pane');
        }
      }
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  private getOrdersPayment() {
    const params = {
      status: 'confirmed',
    };
    this.ordersService
      .getAllPayment(this.query, params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.ordersPayment = value.data;
      });
  }
}
