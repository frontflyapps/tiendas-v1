import { DialogAddShippingComponent } from './../dialog-add-shipping/dialog-add-shipping.component';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { LoggedInUserService } from '../../../../../core/services/loggedInUser/logged-in-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { CurrencyService } from '../../../../../core/services/currency/currency.service';
import { DialogAddEditOffertProductComponent } from '../../../common-dialogs-module/dialog-add-edit-offert-product/dialog-add-edit-offert-product.component';
import { OffertService } from '../../../services/offert/offert.service';
import { IPagination } from 'src/app/core/classes/pagination.class';
import { TaxesShippingService } from '../../../services/taxes-shipping/taxes-shipping.service';
import { DialogEditShippingComponent } from '../dialog-edit-shipping/dialog-edit-shipping.component';

@Component({
  selector: 'app-shipping-table',
  templateUrl: './shipping-table.component.html',
  styleUrls: ['./shipping-table.component.scss'],
})
export class ShippingTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allShipping: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterShipping: boolean;
  loggedInUser: any;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  displayedColumns: string[] = [
    'select',
    'CountryId',
    'ProvinceId',
    'MunicipalityId',
    'products',
    'state',
    'Business',
    'actions',
  ];
  pageSizeOptions: number[] = [25, 50, 100, 250];
  initialPage = 25;
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
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

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private shippingService: TaxesShippingService,
    private breadcrumbService: BreadcrumbService,
    public currencyService: CurrencyService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private showToastr: ShowToastrService,
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
    this.refreshData();
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Tarifas de envío', true);

    ///////////////////////////////////////////

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    ///////////////////////////////////////////

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
            limit: this.initialPage,
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
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.isLoading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][Country][name][$like]');
      this.query.filter.properties.push('filter[$or][Province][name][$like]');
      this.query.filter.properties.push('filter[$or][Municipality][name][$like]');
      this.query.filter.properties.push('filter[$or][Product][name][$like]');
    } else {
      this.query.filter.filterText = '';
    }

    this.shippingService.getAllShippings(this.query).subscribe(
      (data) => {
        this.initTable(data.data);
        this.query.total = data.meta.pagination.total;
        this.selection.clear();
        this.isLoading = false;
      },
      (error) => {
        this.utilsService.errorHandle(error);
        this.selection.clear();
        this.isLoading = false;
      },
    );
  }

  initTable(data) {
    this.allShipping = data;
    this.dataSource = new MatTableDataSource(this.allShipping);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterShipping = true;
  }

  hideSearchForm() {
    this.showFilterShipping = false;
    this.searchForm.controls['textCtrl'].setValue('');
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
  ////////////////////////////////////////////////////////

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  /////// Select logic /////////////////

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
  onAddNewShipping() {
    let dialogRef: MatDialogRef<DialogAddShippingComponent, any>;
    dialogRef = this.dialog.open(DialogAddShippingComponent, {
      panelClass: 'app-dialog-add-shipping',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedTax: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }
  onEditShipping(shipping) {
    this.shippingService.getShipping(shipping).subscribe((data) => {
      let dialogRef: MatDialogRef<DialogEditShippingComponent, any>;
      dialogRef = this.dialog.open(DialogEditShippingComponent, {
        panelClass: 'app-dialog-edit-shipping',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          selectedShipping: data.data,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.refreshData();
      });
    });
  }

  async onRemoveShippings(shippings) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar la(s) Tarifade envío(s)?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          this.spinner.show();
          const data = await Promise.all(shippings.map((item) => this.shippingService.removeShipping(item)));
          this.showToastr.showSucces(
            this.translate.instant('Tarifas de envío eliminadas exitósamente'),
            'Succes',
            7500,
          );
          this.refreshData();
          this.spinner.hide();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);
        this.refreshData();
        this.spinner.hide();
      }
    });
  }

  showProducts(shipping) {
    // console.log('ShippingTableComponent -> showProducts -> shipping', shipping);
    let s = `Productos:\n`;
    shipping?.ShippingProducts.map((item) => {
      s = s + item?.Product.name['es'] + ', \n';
    });
    return s;
  }
}
