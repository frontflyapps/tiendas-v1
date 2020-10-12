import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IPagination } from './../../../../../core/classes/pagination.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { AdminTransactionService } from '../services/admin-orders/admin-transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../../shared/services/product.service';
import { RegionsService } from '../../../services/regions/regions.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { environment } from './../../../../../../environments/environment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfirmationDialogComponent } from '../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminCancelOrderComponent } from '../admin-cancel-order/admin-cancel-order.component';
import { DialogEditOnDeliveryOrderComponent } from '../dialog-edit-on-delivery-order/dialog-edit-on-delivery-order.component';
import { BussinessService } from '../../../services/business/business.service';

@Component({
  selector: 'app-orders-on-delivery-table',
  templateUrl: './orders-on-delivery-table.component.html',
  styleUrls: ['./orders-on-delivery-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrdersOnDeliveryTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  status = 'on-delivery';
  allDeliveries: any[] = [];
  columnsToDisplay = [
    'select',
    'order',
    'fullAddress',
    'deliveryCost',
    'Messenger',
    'destinatario',
    'products',
    'Business',
    'actions',
  ];
  expandedDelivery: any | null = null;

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
  deliveryMessengers = [];

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
  paymentItems: any[] = [];

  displayFn(user?: any): string | undefined {
    return user ? user.name['es'] : undefined;
  }

  ////////////////////////////////////////////////////
  constructor(
    private fb: FormBuilder,
    public loggedInUserService: LoggedInUserService,
    private transactionService: AdminTransactionService,
    public currencyService: CurrencyService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private productService: ProductService,
    private regionService: RegionsService,
    public spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private showToastr: ShowToastrService,
    private businessService: BussinessService,
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

    ///////////////////////////////////////////
    this.formSearch.controls['CountryId'].valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((val) => {
        if (val && val.length !== 0) {
          if (val.toString().trim() !== '') {
            this.queryCountries.filter = {
              filterText: val.toString().trim(),
              properties: ['filter[$or][name][$like]', 'filter[$or][ioc][$like]', 'filter[$or][alpha2][$like]'],
            };
            this.getCountries();
          }
        } else {
          this.queryCountries = {
            limit: 10,
            total: 0,
            offset: 0,
            order: 'name',
            page: 1,
            filter: { filterText: '' },
          };
          this.getCountries();
        }
      });
  }

  initSearchForm() {
    this.formSearch = this.fb.group({
      ProductId: [null, []],
      CountryId: [null, []],
      confirmedRangeDate: this.fb.group({
        startDate: null,
        endDate: null,
      }),
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
    searchFilters.onDelivery = 1;
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
      this.query.filter.properties.push('filter[$or][Payment][order][$like]');
      this.query.filter.properties.push('filter[$or][Payment][address][$like]');
      this.query.filter.properties.push('filter[$or][Payment][Client][name][$like]');
      this.query.filter.properties.push('filter[$or][Payment][email][$like]');
    } else {
      this.query.filter.filterText = '';
    }

    this.transactionService.getAllDeliveries(this.query, searchFilters).subscribe(
      (data) => {
        console.log('OrdersOnDeliveryTableComponent -> refreshData -> data', data);
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

  initTable(data) {
    this.allDeliveries = data;
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

  /////////////////////////////////////////////////////////////////////
  onExpandOrder(element) {
    console.log('OrdersConfirmedTableComponent -> onExpandOrder -> element', element);
    this.isLoading = true;
    this.transactionService.getDelivery(element.id).subscribe(
      (data) => {
        this.expandedDelivery = this.expandedDelivery && this.expandedDelivery?.id == data.data.id ? null : data.data;
        this.isLoading = false;
        if (this.expandedDelivery) {
          const itemArray = this.expandedDelivery?.DeliveryItems.map((x) => {
            return x?.PaymentItem;
          });
          this.paymentItems = itemArray;
        }
      },
      (e) => {
        this.isLoading = true;
      },
    );
  }

  onCancelOrder(delivery) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: this.translate.instant('Estás seguro de cancelar esta orden en proceso de envío?'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let dialogRef2: MatDialogRef<AdminCancelOrderComponent, any>;
        dialogRef2 = this.dialog.open(AdminCancelOrderComponent, {
          width: '550px',
          maxWidth: '100vw',
          data: {
            order: JSON.parse(JSON.stringify(delivery?.Payment)),
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

  onMakeOrderasDelivered(deliveryArray) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      maxWidth: '100vw',
      data: {
        title: 'Confirmación',
        question: ` <blockquote style=" background: #f4f2ff !important;
        border-radius: 3px !important;
        border-left: 5px solid blue;
        margin: 30px 0 !important;
        padding: 30px !important;">
                      <p  style="font-size: 17px;
                      line-height: 30px;
                      font-weight: 400;" > Estás seguro de clasificar estos pedidos como entregados?.
                       Una vez realizada esta acción, se considera que al cliente le llegó su orden, por ende no existen cancelaciones ni devoluciones
                       a través del sistema.</p>
                    </blockquote>`,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const deliveryItems = deliveryArray.map((i) => i.id);
        this.spinner.show();
        this.transactionService.setAsDeliveredPayment({ DeliveryIds: deliveryItems }).subscribe(
          () => {
            this.refreshData();
            this.spinner.hide();
            this.showToastr.showInfo('Entregas realizadas exitósamente', '', 5000);
          },
          (e) => {
            this.spinner.hide();
          },
        );
      }
    });
  }

  editDelivery(delivery) {
    let dialogRef: MatDialogRef<DialogEditOnDeliveryOrderComponent, any>;
    dialogRef = this.dialog.open(DialogEditOnDeliveryOrderComponent, {
      panelClass: 'app-dialog-edit-on-delivery-order',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        selectedDelivery: delivery,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onGetVoucher(delivery) {
    this.transactionService.getDelivery(delivery).subscribe((data) => {
      this.transactionService.getVoucher(data.data.Payment);
    });
  }
}
