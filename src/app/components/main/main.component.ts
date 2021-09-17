import { ConfirmPaymentOkComponent } from './confirm-payment-ok/confirm-payment-ok.component';
import { CookieService } from 'ngx-cookie-service';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Product } from '../../modals/product.model';
import { CartItem } from '../../modals/cart-item';
import { ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { LoggedInUserService } from '../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, of, Observable } from 'rxjs';
import { IUser } from '../../core/classes/user.class';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { ShowSnackbarService } from '../../core/services/show-snackbar/show-snackbar.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CurrencyService } from '../../core/services/currency/currency.service';
import { environment } from '../../../environments/environment';
import { FormControl } from '@angular/forms';
import { SocketIoService } from '../../core/services/socket-io/socket-io.service';
import { NotificationsService } from './notification/notifications.service';
import { MyOrdersService } from '../my-orders/service/my-orders.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { SidebarMenuService } from './sidebar/sidebar-menu.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CategoriesService } from '../../core/services/categories/catagories.service';
import { ConfirmCreateBusinessComponent } from './confirm-create-business/confirm-create-business.component';
import { ConfirmCreateBusinessService } from './confirm-create-business/confirm-create-business.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy {
  public sidenavMenuItems: Array<any>;
  _unsubscribeAll: Subject<any>;

  public currencies: any[];
  public currency: any;
  urlImage: any = environment.imageUrl;

  public flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];

  public flag: any;
  products: Product[];
  indexProduct: number;
  shoppingCartItems: CartItem[] = [];

  public banners = [];

  compareItems: any[] = [];
  compareItemsObservable: Observable<any[]> = of([]);

  public url: any;
  tokenReferal = null;

  navItems: any[] = [];
  loggedInUser: IUser;
  @ViewChild('start', { static: true })
  public sidenav: MatSidenav;
  searchForm: FormControl;
  categories: any[] = [];
  _language = 'es';

  constructor(
    public router: Router,
    private cartService: CartService,
    private translate: TranslateService,
    private navigationService: NavigationService,
    public sidenavMenuService: SidebarMenuService,
    public loggedInUserService: LoggedInUserService,
    private showSnackbBar: ShowSnackbarService,
    private showToastr: ShowToastrService,
    private productService: ProductService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public notificationsService: NotificationsService,
    private cookieService: CookieService,
    private currencyService: CurrencyService,
    private authService: AuthenticationService,
    private socketIoService: SocketIoService,
    private categoryService: CategoriesService,
    private orderSevice: MyOrdersService,
    private orderService: MyOrdersService,
    public utilsService: UtilsService,
    private confirmCreateBusinessService: ConfirmCreateBusinessService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.navItems = this.navigationService.getNavItems();

    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((cart) => {
      this.shoppingCartItems = this.cartService.getShoppingCars();
      let navItemCart = this.navItems.find((item) => item.id == 'cart');
      navItemCart.badgeCount = this.shoppingCartItems.length;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        this.sidenav.close();
      }
    });
    this.searchForm = new FormControl(null, []);
  }

  ngOnInit() {
    const tempFlag = JSON.parse(localStorage.getItem('language'));
    this.flag = tempFlag ? tempFlag : this.flags[0];
    this.currencies = this.currencyService.getCurrencies();
    this.currency = this.currencyService.getCurrency();

    /////// Subscribe to events //////////
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();

      let tempCurrency = JSON.parse(localStorage.getItem('currency'));
      if (tempCurrency) {
        tempCurrency = this.currencies.find((item) => item.name == tempCurrency.name);
        this.currency = tempCurrency ? tempCurrency : this.currencies[0];
      } else {
        this.currency = this.currencies[0];
      }
      localStorage.setItem('currency', JSON.stringify(this.currency));

      const defaultLanguage: any = { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' };
      if ('language' in localStorage) {
        let language = JSON.parse(localStorage.getItem('language'));
        language = language ? language : defaultLanguage;
        this.translate.setDefaultLang(language.lang);
        this.translate.use(language.lang);
      } else {
        this.translate.setDefaultLang(defaultLanguage.lang);
        localStorage.setItem('language', JSON.stringify(defaultLanguage));
      }
      if (this.loggedInUser) {
        this._listenToSocketIO();
      }
    });
    ////////////////////////////////////
    this.compareItemsObservable = this.productService.getComapreProducts();
    this.compareItemsObservable
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((compareItems) => (this.compareItems = compareItems));

    // if (localStorage.getItem('searchText')) {
    //   this.searchForm = new FormControl(JSON.parse(localStorage.getItem('searchText')), []);
    // }
    /////////////////////////////////////////////////////////////////////////////////////
    if (this.loggedInUser) {
      this._listenToSocketIO();
    }
    this.categoryService.getMenu().subscribe((data) => {
      this.categories = data.data;
    });

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this._language = data.lang;
    });
  }

  onSearch() {
    const searchValue = this.searchForm.value;
    localStorage.setItem('searchText', JSON.stringify(searchValue));
    if (searchValue && searchValue.length > 1) {
      this.router.navigate(['/products/search'], { queryParams: { filterText: searchValue } });
    } else {
      this.router.navigate(['/products/search']);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.socketIoService.disconnect();
  }

  public changeCurrency(currency) {
    this.currency = currency;
    this.currencyService.setCurrency(currency);
  }

  public changeLang(flag) {
    this.translate.use(flag.lang);
    localStorage.setItem('language', JSON.stringify(flag));
    this.flag = flag;
    this.loggedInUserService.$languageChanged.next(flag);
  }

  onShowProfile(): void {
    let dialogRef: MatDialogRef<EditProfileComponent, any>;
    dialogRef = this.dialog.open(EditProfileComponent, {
      panelClass: 'app-edit-profile',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  onGotoBackend() {
    document.location.href = environment.adminService;
  }

  onLogout(): void {
    this.authService
      .logout()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        () => {
          this.loggedInUserService.setLoggedInUser(null);
          this.loggedInUserService.removeCookies();
          localStorage.clear();
          this.loggedInUserService.$loggedInUserUpdated.next(null);
          const message = this.translate.instant('User successfully unlogged');
          this.showSnackbBar.showSucces(message, 5000);
          this.router.navigate(['']);
          this.socketIoService.disconnect();
        },
        (err) => {
          const message = this.translate.instant('User sing out unsuccessfully');
          this.showSnackbBar.showError(message, 8000);
          /*this.loggedInUserService.removeCookies();
          this.loggedInUserService.setLoggedInUser(null);
          this.socketIoService.disconnect();
          localStorage.clear();
          this.loggedInUserService.$loggedInUserUpdated.next(null);
          this.router.navigate(['']);*/
        },
      );
  }

  onChangePass() {
    this.router.navigate(['/my-account/change-pass']).then();
    // this.showPaymentSuccess(26);
    // this.showPaymentCancellSuccess(25);
  }

  // ////////////// CREATE BUSINESS TRANSFERMOVIL ////////////////////////////////
  createYourBusiness() {
    const dialogRef = this.dialog.open(ConfirmCreateBusinessComponent, {
      panelClass: 'app-confirm-create-business',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '360px',
      height: 'auto',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goToDigitalPlatformTransfermovil();
      }
    });
  }

  goToDigitalPlatformTransfermovil() {
    this.confirmCreateBusinessService
      .etecsaSignUp()
      .subscribe(dataResponse => {
        console.log('dataResponse', dataResponse);
      });
  }

  // ///////////////////////////////////////////////////////
  _listenToSocketIO() {
    this.socketIoService
      .listen('payment-confirmed')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        if (data?.tpv !== 'enzona') {
          this.showPaymentSuccess(data.Payment.id);
        }
        this.orderSevice.$orderItemsUpdated.next();
        this.cartService.$paymentUpdate.next();
      });

    this.socketIoService
      .listen('payment-cancelled')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.showPaymentCancellSuccess(data.Payment.id);
        console.log('payment-cancelled');
        this.cartService.$paymentUpdate.next();
        this.orderService.$orderItemsUpdated.next();
      });

    this.socketIoService
      .listen('new-notification')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.showToastr.showInfo('Tienes nuevas notificaciones', 'Notificación', 5000);
      });

    this.socketIoService
      .listen('user-logout')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.loggedInUserService.$loggedInUserUpdated.next(null);
        this.router.navigate(['']);
      });

    this.socketIoService
      .listen('business-accepted')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        let token = this.loggedInUserService.getTokenCookie();
        this.authService.getProfile(token).subscribe((user) => {
          const userData = { profile: user.data, Authorization: token };
          this.loggedInUserService.updateUserProfile(userData);
        });
      });
  }

  showPaymentSuccess(id) {
    this.orderService.getPayment(id).subscribe((data) => {
      const dialogRef = this.dialog.open(ConfirmPaymentOkComponent, {
        panelClass: 'app-reservation-payment-ok',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          selectedPayment: data.data,
          action: 'confirmed',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        window.location.reload();
      });
    });
  }

  showPaymentCancellSuccess(id) {
    this.orderService.getPayment(id).subscribe((data) => {
      const dialogRef = this.dialog.open(ConfirmPaymentOkComponent, {
        panelClass: 'app-reservation-payment-ok',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          selectedPayment: data.data,
          action: 'cancelled',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        window.location.reload();
      });
    });
  }
}
