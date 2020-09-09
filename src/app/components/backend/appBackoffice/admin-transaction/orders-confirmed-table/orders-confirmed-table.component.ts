import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IPagination } from './../../../../../core/classes/pagination.class';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { AdminTransactionService } from '../services/admin-orders/admin-transaction.service';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../../shared/services/product.service';
import { RegionsService } from '../../../services/regions/regions.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { environment } from './../../../../../../environments/environment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfirmationDialogComponent } from '../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { DialogAsignOrderToMessengerComponent } from '../dialog-asign-order-to-messenger/dialog-asign-order-to-messenger.component';
import { AdminCancelOrderComponent } from '../admin-cancel-order/admin-cancel-order.component';
import { BussinessService } from '../../../services/business/business.service';

@Component({
  selector: 'app-orders-confirmed-table',
  templateUrl: './orders-confirmed-table.component.html',
  styleUrls: ['./orders-confirmed-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdersConfirmedTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  status = ['confirmed', 'on-delivery'];
  allOrders: any[] = [];
  columnsToDisplay = [
    'select',
    'order',
    'tpv',
    'amount',
    'date',
    'address',
    'destinatario',
    'Client',
    'products',
    'status',
    'Business',
    'actions',
  ];
  expandedOrder: any | null = null;

  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterOrders: boolean;
  loggedInUser: any;

  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';

  pageSizeOptions: number[] = [50, 100, 500, 1000, 5000];
  initialPage = 50;
  searchElementCount = 0;
  allProducts: any[] = [];
  allRegions: any[] = [];
  allBusiness: any[] = [];

  ////////////////////////////////
  query: IPagination = {
    limit: this.initialPage,
    offset: 0,
    total: 0,
    page: 0,
    order: '-createdAt',
    filter: {
      filterText: '',
      properties: [],
    },
  };

  isLoading = false;
  formSearch: FormGroup;
  formRangeDate: FormGroup;

  ///////////////////////////////
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /////////////////////////////////////////////////////
  queryCountries: IPagination = {
    limit: this.initialPage,
    total: 0,
    offset: 0,
    order: '-name',
    page: 1,
    filter: { filterText: '', properties: [] },
  };

  allCountries: any[] = [];

  displayFn(user?: any): string | undefined {
    return user ? user.name['es'] : undefined;
  }

  ////////////////////////////////////////////////////
  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private transactionService: AdminTransactionService,
    public currencyService: CurrencyService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private productService: ProductService,
    private businessService: BussinessService,
    private showToastr: ShowToastrService,
    private regionService: RegionsService,
    private utilsService: UtilsService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.createSearchForm();
    this.initSearchForm();
    this.fetchingData();
    this.refreshData();

    this.searchForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged(), debounceTime(250))
      .subscribe((val) => {
        if (val.textCtrl.length !== 0) {
          if (val.textCtrl.toString().trim() !== '') {
            this.refreshData();
            this.paginator.firstPage();
          }
        } else {
          this.query = {
            limit: 10,
            offset: 0,
            total: 0,
            page: 0,
            order: '-createdAt',
            filter: {
              filterText: '',
            },
          };
          this.refreshData();
          this.paginator.firstPage();
        }
      });

    ///////////////////////////////////////////
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  initSearchForm() {
    this.formRangeDate = this.fb.group({
      startDate: [null],
      endDate: [null],
    });

    this.formSearch = this.fb.group({
      ProductId: [null, []],
      CountryId: [null, []],
      confirmedRangeDate: this.formRangeDate,
      BusinessId: null,
      order: [null, []],
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.isLoading = true;
    const searchFilters = { ...this.formSearch.value };
    searchFilters.status = this.status;
    searchFilters.CountryId = searchFilters.CountryId ? searchFilters.CountryId.id : null;

    if (searchFilters.confirmedRangeDate && searchFilters.confirmedRangeDate.startDate) {
      searchFilters.startDate = searchFilters.confirmedRangeDate.startDate.startOf('days').toISOString();
      searchFilters.endDate = searchFilters.confirmedRangeDate.endDate.endOf('days').toISOString();
      delete searchFilters.confirmedRangeDate;
    }

    const searchvalue = this.searchForm.controls['textCtrl'].value;

    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][order][$like]');
      this.query.filter.properties.push('filter[$or][address][$like]');
      this.query.filter.properties.push('filter[$or][Client][name][$like]');
      this.query.filter.properties.push('filter[$or][email][$like]');
    } else {
      this.query.filter.filterText = '';
    }

    this.transactionService.getAllOrders(this.query, searchFilters).subscribe(
      (data) => {
        this.initTable(data.data);
        this.selection.clear();
        this.query.total = data.meta.pagination.total;
        this.isLoading = false;
      },
      (error) => {
        this.selection.clear();
        this.isLoading = false;
      },
    );
  }

  // processTransactionData(data) {
  //   return data.map((item) => {
  //     delete item.fullConfirmResponse;
  //     item.Transaction = item.PaymentTransactions.map((item) => item.Transaction);
  //     item.countTypeProducts = item.Transaction.length;
  //     item.fullAddress =
  //       item.address + ', ' + item.regionProvinceState + ', ' + item.city + ', ' + item.Country.name['es'];
  //     delete item.PaymentTransactions;
  //     return item;
  //   });
  // }

  initTable(data) {
    this.allOrders = data.map((item) => {
      item.fullAddress = item.address;
      if (item.CountryId == 59) {
        item.fullAddress +=
          ', ' + item.Municipality?.name + ', ' + item.Province?.name + ', ' + item.Country?.name['es'];
      } else {
        item.fullAddress += item.city + ', ' + item.regionProvinceState + ', ' + item.Country?.name['es'];
      }
      return item;
    });
    this.dataSource = new MatTableDataSource(data);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterOrders = true;
  }

  hideSearchForm() {
    this.showFilterOrders = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  /////// Select logic/////////////////

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  //////////////////////////////
  //////////////////// Pagination Api ////////////////////////////
  OnPaginatorChange(event) {
    if (event) {
      this.query.limit = event.pageSize || this.initialPage;
      this.query.offset = event.pageIndex * event.pageSize;
      this.query.page = event.pageIndex;
    } else {
      this.query.limit = this.initialPage;
      this.query.offset = 0;
      this.query.page = 1;
    }
    this.refreshData();
  }

  //////////////////////////////////////////////////////////////
  fetchingData() {
    this.productService.getAllAdminProducts().subscribe((data) => {
      this.allProducts = [...data.data];
    });
    this.businessService.getAllBussiness().subscribe((data) => {
      this.allBusiness = [...data.data];
    });
  }

  getCountries() {
    this.regionService.getAllCountries(this.queryCountries).subscribe(
      (data) => {
        this.allCountries = data.data;
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  getFullAddress(item) {
    item.fullAddress = item.address;
    if (item.CountryId == 59) {
      item.fullAddress += ', ' + item.Municipality?.name + ', ' + item.Province?.name + ', ' + item.Country?.name['es'];
    } else {
      item.fullAddress += item.city + ', ' + item.regionProvinceState + ', ' + item.Country?.name['es'];
    }
    return item.fullAddress;
  }

  /////////////////////////////////////////////////////////////////////
  onExpandOrder(element) {
    console.log('OrdersConfirmedTableComponent -> onExpandOrder -> element', element);
    this.isLoading = true;
    this.transactionService.getOrder(element.id).subscribe(
      (data) => {
        this.expandedOrder = this.expandedOrder && this.expandedOrder?.id == data.data.id ? null : data.data;
        this.isLoading = false;
      },
      (e) => {
        this.isLoading = true;
      },
    );
  }

  onCancelOrder(order) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: this.translate.instant('Are you sure to cancell this order?'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let dialogRef2: MatDialogRef<AdminCancelOrderComponent, any>;
        dialogRef2 = this.dialog.open(AdminCancelOrderComponent, {
          width: '550px',
          maxWidth: '100vw',
          data: {
            order: JSON.parse(JSON.stringify(order)),
          },
        });

        dialogRef2.afterClosed().subscribe((result2) => {
          if (result2) {
            this.refreshData();
          }
        });
      }
    });
  }

  onAssignToMessenger(orderArray) {
    // console.log('OrdersConfirmedTableComponent -> onAssignToMessenger -> orderArray', orderArray);
    // this.showToastr.showInfo(
    //   'Se esta trabajando en esta funcionalidad no esta disponible ne estos momentos',
    //   'Información',
    // );
    // return true;
    let dialogRef: MatDialogRef<DialogAsignOrderToMessengerComponent, any>;
    dialogRef = this.dialog.open(DialogAsignOrderToMessengerComponent, {
      panelClass: 'app-dialog-asign-order-to-messenger',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        selectedOrders: orderArray,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onGetVoucher(order) {
    this.transactionService.getVoucher(order);
  }
}
