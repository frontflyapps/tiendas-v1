import { MetaService } from 'src/app/core/services/meta.service';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { IPagination } from './../../../core/classes/pagination.class';
import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { environment } from './../../../../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyOrdersService } from '../service/my-orders.service';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from './../../../core/services/currency/currency.service';
import { HttpClient } from '@angular/common/http';
import { CancelOrderComponent } from '../cancel-order/cancel-order.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyOrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  _unsubscribeAll: Subject<any>;
  formSearch: FormControl = new FormControl([null]);
  isHandset = false;
  urlImage = environment.apiUrl;
  innerWidth;
  applyStyle = false;
  selectedOrder = null;
  showOrderDetails = false;
  @ViewChild('drawer', { static: true })
  public sidenav: MatSidenav;
  language: any;

  allOrders: any[] = [];
  arrayImages: any[] = [];
  mainImage = null;
  changeImage = false;

  status: any = {
    confirmed: {
      status: {
        es: 'pagado',
        en: 'confirmed',
      },
      primary: '#4caf50',
      weight: 400,
      class: 'payedLabel',
    },
    requested: {
      status: {
        es: 'solicitado',
        en: 'requested',
      },
      primary: '#ffc107',
      weight: 400,
      class: 'requestedLabel',
    },
    cancelled: {
      status: {
        es: 'cancelado',
        en: 'cancelled',
      },
      primary: '#f44336',
      weight: 400,
      class: 'cancelledLabel',
    },
    error: {
      status: {
        es: 'error en el pago',
        en: 'error en el pago',
      },
      primary: '#e53935',
      weight: 600,
      class: 'errorLabel',
    },
    'processing-cancel': {
      status: {
        es: 'canc. en progreso',
        en: 'processing cancel',
      },
      primary: '#795548',
      weight: 400,
      class: 'processingCancelLabel',
    },
    delivered: {
      status: {
        es: 'entregado',
        en: 'delivered',
      },
      weight: 600,
      primary: '#2196f3',
      class: 'deliveredLabel',
    },
    'on-delivery': {
      status: {
        es: 'en camino',
        en: 'on Delivery',
      },
      weight: 600,
      primary: '#ff5722',
      class: 'onDeliveryLabel',
    },
  };
  initialLimit = 20;
  query: IPagination = {
    limit: this.initialLimit,
    offset: 0,
    order: '-createdAt',
    total: 0,
    filter: {
      filterText: null,
      properties: [],
    },
  };

  loadingSearch = true;
  loadingSelectedItem = false;

  param: any = {
    status: [
      'requested',
      'confirmed',
      'on-delivery',
      'delivered',
      'processing-cancel',
      'cancelled',
      'expired',
      'error',
    ],
  };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    private ordersService: MyOrdersService,
    private loggedInUserService: LoggedInUserService,
    private translateService: TranslateService,
    public currencyService: CurrencyService,
    private breakpointObserver: BreakpointObserver,
    private httpClient: HttpClient,
    private activateRoute: ActivatedRoute,
    private showToastr: ShowToastrService,
    private metaService: MetaService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.isHandset = data.matches;
      });
    this.activateRoute.queryParams.subscribe((data) => {
      if (data?.orderId) {
        this.onSelectOrder(data?.orderId);
      }
    });
    this.metaService.setMeta(
      environment.meta?.mainPage?.title,
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit() {
    this.onSearch();
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.formSearch.valueChanges.pipe(debounceTime(250), takeUntil(this._unsubscribeAll)).subscribe((value) => {
      let searchValue = value || '';
      this.loadingSearch = true;
      searchValue = value.toLowerCase().trim();
      this.query.filter.properties = [];
      this.query.filter.filterText = searchValue;
      this.query.filter.properties.push('filter[$or][Country][name][$like]');
      this.query.filter.properties.push('filter[$or][Province][name][$like]');
      this.query.filter.properties.push('filter[$or][Municipality][name][$like]');
      this.query.filter.properties.push('filter[$or][Product][name][$like]');
      // this.query.filter.properties.push('filter[$or][Category][name][$like]');
      this.query.total = 0;
      this.query.offset = 0;
      this.onSearch();
    });
  }

  ngAfterViewInit(): void {
    if (this.isHandset) {
      setTimeout(() => {
        this.sidenav.toggle();
      }, 250);
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onFilter() {
    let value = this.formSearch.value;
    let searchValue = value || '';
    this.loadingSearch = true;
    searchValue = value.toLowerCase().trim();
    this.query.filter.properties = [];
    this.query.filter.filterText = searchValue;
    this.query.filter.properties.push('filter[$or][Country][name][$like]');
    this.query.filter.properties.push('filter[$or][Province][name][$like]');
    this.query.filter.properties.push('filter[$or][Municipality][name][$like]');
    this.query.filter.properties.push('filter[$or][Product][name][$like]');
    // this.query.filter.properties.push('filter[$or][Category][name][$like]');
    this.query.total = 0;
    this.query.offset = 0;
    this.onSearch();
  }

  onSearch() {
    this.loadingSearch = true;
    this.ordersService.getAllPayment(this.query, this.param).subscribe(
      (data) => {
        this.allOrders = [...data.data];
        console.log('MyOrdersComponent -> onSearch -> this.allOrders', this.allOrders);
        this.query.offset += data.meta.pagination.count;
        this.query.total = data.meta.pagination.total;
        this.loadingSearch = false;
      },
      (error) => {
        this.loadingSearch = false;
      },
    );
  }

  onLoadMore() {
    this.loadingSearch = true;
    this.ordersService.getAllPayment(this.query, this.param).subscribe(
      (data) => {
        this.allOrders = this.allOrders.concat(data.data);
        this.query.offset += data.meta.pagination.count;
        this.query.total = data.meta.pagination.total;
        this.loadingSearch = false;
      },
      (e) => {
        this.loadingSearch = false;
      },
    );
  }

  onSelectOrder(item) {
    this.loadingSelectedItem = true;
    this.ordersService.getPayment(item).subscribe(
      (data) => {
        this.selectedOrder = data.data;
        // console.log('MyOrdersComponent -> onSelectOrder -> this.selectedOrder', this.selectedOrder);
        this.showOrderDetails = true;
        this.loadingSelectedItem = false;
        if (this.isHandset) {
          setTimeout(() => {
            this.sidenav.toggle();
          }, 250);
        }
      },
      (e) => {
        this.loadingSelectedItem = false;
      },
    );
  }

  processTransactionData(data) {
    return data.map((item) => {
      delete item.fullConfirmResponse;
      item.Transaction = item.PaymentTransactions.map((item) => item.Transaction);
      item.countTypeProducts = item.Transaction.length;
      item.fullAddress =
        item.address + ', ' + item.regionProvinceState + ', ' + item.city + ', ' + item.Country.name[this.language];
      delete item.PaymentTransactions;
      return item;
    });
  }

  onEditOrder(order)  {
    let dialogRef: MatDialogRef<EditOrderComponent, any>;

    dialogRef = this.dialog.open(EditOrderComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        order: JSON.parse(JSON.stringify(order)),
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onSelectOrder(order);
      window.location.reload();
    });
  }

  onCancelarOrder(order) {
    let dialogRef: MatDialogRef<CancelOrderComponent, any>;

    dialogRef = this.dialog.open(CancelOrderComponent, {
      width: '650px',
      maxWidth: '100vw',
      data: {
        order: JSON.parse(JSON.stringify(order)),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.query = {
          limit: this.initialLimit,
          offset: 0,
          order: '-createdAt',
          total: 0,
          filter: {
            filterText: null,
            properties: [],
          },
        };
        if (this.isHandset) {
          setTimeout(() => {
            this.selectedOrder = undefined;
            this.sidenav.toggle();
            // document.location.reload();
          }, 250);
        }
        this.ordersService.$orderItemsUpdated.next();
        this.onSelectOrder(order);
        this.onSearch();
      }
    });
  }

  onGetVoucher(order) {
    const urlDownload = environment.apiUrl + 'payment/' + order.id + '/voucher';

    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    this.httpClient
      .get(urlDownload, httpOptions)
      .toPromise()
      .then((data) => {
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `Voucher-${order.order}.pdf`;
        link.click();
      });
  }

  onDownloadDigitalProduct(url) {
    const urlDownload = url + '?Authorization=' + this.loggedInUserService.getTokenCookie();
    const link = document.createElement('a');
    link.href = urlDownload;
    link.download = 'data';
    link.target = '_blank';
    link.click();
  }
}
