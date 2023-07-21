import { ConfirmPaymentOkComponent } from './confirm-payment-ok/confirm-payment-ok.component';
import { CookieService } from 'ngx-cookie-service';
import { MatSidenav } from '@angular/material/sidenav';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Product } from '../../modals/product.model';
import { CartItem } from '../../modals/cart-item';
import { ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { LoggedInUserService } from '../../core/services/loggedInUser/logged-in-user.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { IUser } from '../../core/classes/user.class';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';
import { ShowSnackbarService } from '../../core/services/show-snackbar/show-snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CurrencyService } from '../../core/services/currency/currency.service';
import { environment } from '../../../environments/environment';
import { FormControl, UntypedFormControl } from '@angular/forms';
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
import { DialogSetLocationComponent } from './dialog-set-location/dialog-set-location.component';
import { LOCATION } from '../../core/classes/storageNames.class';
import { LocationService } from '../../core/services/location/location.service';
import { MyContactsComponent } from './my-contacts/my-contacts.component';
import { MENU_DATA } from '../../core/classes/global.const';
import { LocalStorageService } from '../../core/services/localStorage/localStorage.service';
import { GlobalStateOfCookieService } from '../../core/services/request-cookie-secure/global-state-of-cookie.service';
import Shepherd from 'shepherd.js';
import { compile } from 'sass';
import { CategoryMenuNavService } from '../../core/services/category-menu-nav.service';
import { Meta } from '@angular/platform-browser';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  public sidenavMenuItems: Array<any>;
  _unsubscribeAll: Subject<any>;

  isOwner = false;

  public currencies: any[];
  public currency: any;
  public logo = environment.logoWhite;
  urlImage: any = environment.imageUrl;

  public province: any = null;
  public municipality: any = null;
  public business: any = null;

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
  navItems: any[] = [];
  loggedInUser: IUser;
  @ViewChild('start', { static: true })
  public sidenav: MatSidenav;
  searchForm: UntypedFormControl;
  categories: any[] = [];
  _language = 'es';
  businessConfig = JSON.parse(localStorage.getItem('business-config'));

  tour = new Shepherd.Tour({
    useModalOverlay: false,
    defaultStepOptions: {
      classes: 'shadow-md bg-purple-dark',
      scrollTo: true,
    },
  });

  innerWidth: any;

  constructor(
    public router: Router,
    private cartService: CartService,
    private translate: TranslateService,
    private navigationService: NavigationService,
    public sidenavMenuService: SidebarMenuService,
    public loggedInUserService: LoggedInUserService,
    private localStorageService: LocalStorageService,
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
    private meta: Meta,
    public utilsService: UtilsService,
    private confirmCreateBusinessService: ConfirmCreateBusinessService,
    private locationService: LocationService,
    private globalStateOfCookieService: GlobalStateOfCookieService,
    private categoryMenuServ: CategoryMenuNavService,
  ) {
    this.metaAdd();
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
        this.sidenav?.close().then();
      }
    });
    this.searchForm = new FormControl(null, []);

    this.tour = new Shepherd.Tour({
      useModalOverlay: false,
      defaultStepOptions: {
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true,
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.globalStateOfCookieService.getCookieState() ? this.initComponent() : this.setSubscriptionToCookie();
  }

  public metaAdd() {
    this.meta.updateTag({name: 'title', content: environment.meta.mainPage.title});
    this.meta.updateTag({name: 'description', content: environment.meta.mainPage.description});
    this.meta.updateTag({name: 'keywords', content: environment.meta.mainPage.keywords});

    this.meta.updateTag({property: 'og:url', content: environment.meta.mainPage.url});
    this.meta.updateTag({property: 'og:site_name', content: environment.meta.mainPage.title});
    this.meta.updateTag({property: 'og:image', itemprop: 'image primaryImageOfPage', content: environment.meta.mainPage.shareImg});

    this.meta.updateTag({property: 'twitter:domain', content: environment.meta.mainPage.url});
    this.meta.updateTag({property: 'twitter:title', content: environment.meta.mainPage.title});
    this.meta.updateTag({property: 'og:title', itemprop: 'name', content: environment.meta.mainPage.title});
    this.meta.updateTag({property: 'twitter:description', content: environment.meta.mainPage.description});
    this.meta.updateTag({property: 'og:description', itemprop: 'description', content: environment.meta.mainPage.description});
    this.meta.updateTag({property: 'twitter:image', content: environment.meta.mainPage.shareImg});
  }

  initComponent() {
    this.initSubsLocation();
    this.getLocationOnLocalStorage();

    const tempFlag = JSON.parse(localStorage.getItem('language'));
    this.flag = tempFlag ? tempFlag : this.flags[0];
    this.currencies = this.currencyService.getCurrencies();
    this.currency = this.currencyService.getCurrency();

    // ///// Subscribe to events //////////
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
        // this._listenToSocketIO();
      }
    });
    // //////////////////////////////////
    this.compareItemsObservable = this.productService.getComapreProducts();
    this.compareItemsObservable
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((compareItems) => (this.compareItems = compareItems));

    // if (localStorage.getItem('searchText')) {
    //   this.searchForm = new FormControl(JSON.parse(localStorage.getItem('searchText')), []);
    // }
    // ///////////////////////////////////////////////////////////////////////////////////
    if (this.loggedInUser) {
      // this._listenToSocketIO();
    }

    // this.getFromStorage();
    this.getMenu();

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this._language = data.lang;
    });

    // Open location dialog when app start
    const location = JSON.parse(localStorage.getItem('location'));
    if (!location?.province) {
      this.openSetLocation();
    }
  }

  setSubscriptionToCookie() {
    this.globalStateOfCookieService.stateOfCookie$.pipe(takeUntil(this._unsubscribeAll)).subscribe((thereIsCookie) => {
      if (thereIsCookie) {
        this.initComponent();
      }
    });
  }

  getFromStorage(): void | boolean {
    try {
      const menuData = this.localStorageService.getFromStorage(MENU_DATA);

      if (!menuData || !menuData?.timespan) {
        this.getMenu();
        return false;
      }

      if (this.localStorageService.iMostReSearch(menuData?.timespan, environment.timeToResearchMenuData)) {
        this.getMenu();
      } else {
        this.saveCategories(menuData.menu);
      }
    } catch (e) {
      this.getMenu();
    }
  }

  /**
   * Saving categories received from API
   * @param menuData
   */
  saveCategories(menuData) {
    this.categories = menuData.map((object) => {
      return { ...object, active: false };
    });
    this.categoryMenuServ.setCategories(this.categories);
  }

  onSearch() {
    const searchValue = this.searchForm.value;
    console.log(this.searchForm.value);
    localStorage.setItem('searchText', JSON.stringify(searchValue));
    if (searchValue && searchValue.length > 1) {
      this.router.navigate(['/products/search'], { queryParams: { filterText: searchValue } }).then();
    } else {
      this.router.navigate(['/products/search']).then();
    }
  }

  ngOnDestroy(): void {
    if (this._unsubscribeAll) {
      this._unsubscribeAll.next('');
      this._unsubscribeAll.complete();
      this._unsubscribeAll.unsubscribe();
    }
    this.socketIoService.disconnect();
  }

  public changeCurrency(currency) {
    console.log(currency);
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

  onShowMyContacts(): void {
    let dialogRef: MatDialogRef<MyContactsComponent, any>;
    dialogRef = this.dialog.open(MyContactsComponent, {
      panelClass: 'app-my-contacts',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '40rem',
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
          // localStorage.clear();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('cartItem');
          this.cartService.$cartItemsUpdated.next(null);
          this.loggedInUserService.$loggedInUserUpdated.next(null);
          const message = this.translate.instant('User successfully unlogged');
          this.showSnackbBar.showSucces(message, 5000);
          this.router.navigate(['']).then();
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
      maxHeight: '100%',
      // width: '70em',
      // height: 'auto',
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/become-a-seller']).then();
      }
    });
  }

  // goToDigitalPlatformTransfermovil() {
  //   this.confirmCreateBusinessService
  //     .etecsaSignUp()
  //     .subscribe(dataResponse => {
  //       console.log('dataResponse', dataResponse);
  //     });
  // }

  // ///////////////////////////////////////////////////////
  _listenToSocketIO() {
    this.socketIoService
      .listen('payment-confirmed')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        if (data?.tpv !== 'enzona') {
          this.showPaymentSuccess(data.Payment.id);
        }
        this.orderSevice.$orderItemsUpdated.next('');
        this.cartService.$paymentUpdate.next('');
      });

    this.socketIoService
      .listen('payment-cancelled')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.showPaymentCancellSuccess(data.Payment.id);
        console.log('payment-cancelled');
        this.cartService.$paymentUpdate.next('');
        this.orderService.$orderItemsUpdated.next('');
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
        this.router.navigate(['']).then();
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

  openSetLocation() {
    const dialogRef = this.dialog.open(DialogSetLocationComponent, {
      panelClass: 'app-dialog-set-location',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '35rem',
      data: {
        provinceData: this.province,
        municipalityData: this.municipality,
        // businessData: this.business,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.locationService.updateLocation(result);
      }
    });
  }

  getLocationOnLocalStorage() {
    let locationOnLocalStorage;
    try {
      locationOnLocalStorage = JSON.parse(localStorage.getItem(LOCATION));
      if (locationOnLocalStorage) {
        this.locationService.updateLocation(locationOnLocalStorage);
      }
    } catch (e) {
      console.warn('-> Error getItem storage', e);
    }
  }

  setLocationData(locationOnLocalStorage) {
    this.municipality = locationOnLocalStorage.municipality;
    this.province = locationOnLocalStorage.province;
    this.business = locationOnLocalStorage.business;
  }

  initSubsLocation() {
    this.locationService.location$
      .pipe(distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe((newLocation) => {
        this.setLocationData(newLocation);
        localStorage.setItem(LOCATION, JSON.stringify(newLocation));
      });
  }

  private getMenu() {
    this.categoryService.getMenu().subscribe((data) => {
      console.log('-> data private getMenu()', data);

      // let _response: any = {};
      // _response['menu'] = JSON.parse(JSON.stringify(data.data));
      // _response['timespan'] = new Date().getTime();
      //
      // this.localStorageService.setOnStorage(MENU_DATA, _response);

      this.saveCategories(data.data);
    });
  }

  ngAfterViewInit() {
    if (innerWidth >= 960) {
      this.addAttention('.info-location');
    } else {
      this.addAttention('.mobile-location');
    }
  }

  public addAttention(attentionClass: string) {
    const dialog = this.dialog;
    const location = JSON.parse(localStorage.getItem('location'));
    let locationServ = this.locationService;

    this.tour.addStep({
      id: 'example-step',
      text: `Los primeros resultados de búsqueda serán los productos de tiendas más cercanas a:<br><br><strong>${
        location?.province?.name
      }</strong> &nbsp; ${location?.municipality ? location?.municipality.name : ''}`,
      attachTo: {
        element: attentionClass,
        on: 'bottom',
      },
      classes: 'example-step-extra-class',
      buttons: [
        {
          text: 'Olvidar',
          classes: 'forgot-button',
          action() {
            // Dismiss the tour when the forgot button is clicked
            localStorage.setItem('location-attention', 'yes');
            return this.cancel();
          },
        },
        {
          text: 'Cambiar',
          action() {
            return this.hide();
          },
        },
        {
          text: 'Aceptar',
          classes: 'accept-button',
          action: this.tour.complete,
        },
      ],
      when: {
        hide: function () {
          const dialogRef = dialog.open(DialogSetLocationComponent, {
            panelClass: 'app-dialog-set-location',
            maxWidth: '100vw',
            maxHeight: '100vh',
            width: '35rem',
            data: {
              provinceData: location?.province,
              municipalityData: location?.municipality,
              businessData: location?.business,
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              locationServ.updateLocation(result);
            }
          });
        },
      },
    });

    // Initiate the tour
    if (!localStorage.getItem('location-attention') && location?.province != null) {
      this.tour.start();
    }
  }
}
