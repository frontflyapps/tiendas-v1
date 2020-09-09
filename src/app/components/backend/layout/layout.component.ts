import { NavigationService } from './../../../core/services/navigation/navigation.service';
import { AuthenticationService } from './../../../core/services/authentication/authentication.service';
import { Component, ViewChild, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IUser } from '../../../core/classes/user.class';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../environments/environment';
import { PanelNotificationsComponent } from '../common-layout-components/panel-notifications/panel-notifications.component';
import { StateCreatingProductService } from '../services/state-creating-product/state-creating-product.service';
import { SpinnerLoadingService } from '../services/spinner-loading/spinner-loading.service';
import { AdminEditProfileComponent } from '../common-dialogs-module/admin-edit-profile/admin-edit-profile.component';
import { AdminTransactionService } from '../appBackoffice/admin-transaction/services/admin-orders/admin-transaction.service';
import { ShowSnackbarService } from 'src/app/core/services/show-snackbar/show-snackbar.service';
import { BussinessService } from '../services/business/business.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, OnDestroy {
  _unsubscribeAll: Subject<any>;

  applyStyle = false;
  innerWidth: any;
  previousUrl = '';
  currentUrl = '';
  loggedInUser: IUser;
  userUrl = environment.apiUrl;
  separator = '/';
  isHandset = false;
  navBarQuerySubscription: Subscription;
  navRouterSubscription: Subscription;
  userUpdatedSubscription: Subscription;
  routeChangeSubscrition: Subscription;
  isSmallDevice: boolean;
  language: string;
  valueSpiner = 50;
  bufferValue = 75;

  public flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];
  public currencies = ['USD', 'EUR'];

  flag: any = null;
  currency: any = null;

  @ViewChild('drawer', { static: true })
  public sidenav: MatSidenav;
  navigationData: any[] = [];
  year: any = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public stateCreatingProductService: StateCreatingProductService,
    private router: Router,
    public dialog: MatDialog,
    private navigationService: NavigationService,
    public authService: AuthenticationService,
    public spinnerLoading: SpinnerLoadingService,
    private showSnackbBar: ShowSnackbarService,
    private loggedInUserService: LoggedInUserService,
    private translate: TranslateService,
    private transactionService: AdminTransactionService,
    private businessService: BussinessService,
  ) {
    this._unsubscribeAll = new Subject<any>();

    this.loggedInUser = loggedInUserService.getLoggedInUser();
    this.navigationData = this.navigationService.getNavBackend();

    this.flags = this.loggedInUserService.getlaguages();

    this.navBarQuerySubscription = this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Handset, Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Tablet])
      .subscribe((data) => {
        this.isHandset = data.matches;
        this.isSmallDevice = data.matches;
      });

    this.navRouterSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        if (this.isHandset && this.sidenav && this.sidenav.opened) {
          const TimeCloseSid = setTimeout(() => {
            this.sidenav.close();
            clearTimeout(TimeCloseSid);
          }, 250);
        }
      }
    });

    this.year = new Date().getFullYear();
  }

  logout(): void {
    this.removeCookies();
    localStorage.removeItem('user');
    this.loggedInUserService.setLoggedInUser(null);
    localStorage.clear();
    this.router.navigate(['authentication']);
  }

  removeCookies() {
    const res = document.cookie;
    const multiple = res.split(';');
    for (let i = 0; i < multiple.length; i++) {
      const key = multiple[i].split('=');
      document.cookie = key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC';
    }
  }

  ngOnInit() {
    this.updatingNavigationItems();
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }

    this.userUpdatedSubscription = this.loggedInUserService.$loggedInUserUpdated.subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });

    const tempCurrency = JSON.parse(localStorage.getItem('currency'));
    const tempFlag = JSON.parse(localStorage.getItem('language'));
    this.flag = tempFlag ? tempFlag : this.flags[0];
    this.currency = tempCurrency ? tempCurrency : this.currencies[0];
    ///////////////////////////////////
    this.updatingTheBadges();
  }

  ngOnDestroy(): void {
    if (this.navBarQuerySubscription) {
      this.navBarQuerySubscription.unsubscribe();
    }
    if (this.navRouterSubscription) {
      this.navRouterSubscription.unsubscribe();
    }
    if (this.routeChangeSubscrition) {
      this.routeChangeSubscrition.unsubscribe();
    }
    if (this.userUpdatedSubscription) {
      this.userUpdatedSubscription.unsubscribe();
    }

    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /////////////// View Notifications //////////////////
  onViewNotifications(): void {
    let dialogRef: MatDialogRef<PanelNotificationsComponent, any>;
    dialogRef = this.dialog.open(PanelNotificationsComponent, {
      panelClass: 'app-panel-notifications',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.onRefreshData();
      }
    });
  }

  /////// Edit Profile /////
  onEditProfile(): void {
    let dialogRef: MatDialogRef<AdminEditProfileComponent, any>;
    dialogRef = this.dialog.open(AdminEditProfileComponent, {
      panelClass: 'app-admin-edit-profile',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  onGoShop() {
    let linkNav: any = document.getElementById('linkNavBack');
    linkNav.href = '#';
    linkNav.click();
  }

  ////// Change Lenguaje ///////////
  public changeLang(flag) {
    this.translate.use(flag.lang);
    localStorage.setItem('language', JSON.stringify(flag));
    this.flag = flag;
    this.loggedInUserService.$languageChanged.next(flag);
  }

  updatingTheBadges() {
    this.transactionService
      .getAllOrders({ limit: 1, offset: 0 }, { status: 'confirmed', onDelivery: 0 })
      .subscribe((data) => {
        let navItemTransaction = this.navigationData.find((item) => item.id == 'Payment');
        if (navItemTransaction) {
          navItemTransaction.badgeCount = data.meta.pagination.total;
          navItemTransaction.matTooltipText = 'Ordenes confirmadas que esperan entregadas';
        }
      });
    this.businessService
      .getAllBussiness({ limit: 1, offset: 0 }, { status: 'created', onDelivery: 0 })
      .subscribe((data) => {
        let navItemBusiness = this.navigationData.find((item) => item.id == 'Business');
        if (navItemBusiness) {
          navItemBusiness.badgeCount = data.meta.pagination.total;
          navItemBusiness.matTooltipText = 'Negocios pendientes ha ser integrados';
        }
      });
  }

  updatingNavigationItems() {
    const isAdmin = this.loggedInUserService.isAdminUser();
    const isMessenger = this.loggedInUserService.isMessengerUser();
    const isOwner = this.loggedInUserService.isOwnerUser();

    for (const navItem of this.navigationData) {
      navItem.display = false;
      if (isAdmin) {
        navItem.display = true;
      } else if (isOwner) {
        if (
          navItem.id == 'Payment' ||
          navItem.id == 'Offer' ||
          navItem.id == 'User' ||
          navItem.id == 'Product' ||
          navItem.id == 'Business' ||
          navItem.id == 'Person' ||
          navItem.id == 'Shipping'
        ) {
          navItem.display = true;
        }
      } else if (isMessenger) {
        if (navItem.id == 'Payment') {
          navItem.display = true;
        }
      } else {
        navItem.display = false;
      }
    }
  }

  onLogout(): void {
    const linkNav: any = document.getElementById('linkNavBack');
    linkNav.href = '#';

    this.authService
      .logout()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        () => {
          this.loggedInUserService.setLoggedInUser(null);
          localStorage.clear();
          this.loggedInUserService.$loggedInUserUpdated.next(null);
          const message = this.translate.instant('User successfully unlogged');
          this.showSnackbBar.showSucces(message, 5000);
          linkNav.click();
        },
        (err) => {
          const message = this.translate.instant('User sing out unsuccessfully');
          this.showSnackbBar.showError(message, 8000);
          this.loggedInUserService.setLoggedInUser(null);
          localStorage.clear();
          this.loggedInUserService.$loggedInUserUpdated.next(null);
          linkNav.click();
        },
      );
  }
}
