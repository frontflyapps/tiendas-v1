import { DialogAddEditOffertCategoryComponent } from '../../../common-dialogs-module/dialog-add-edit-offert-category/dialog-add-edit-offert-category.component';
import { IPagination } from '../../../../../core/classes/pagination.class';
import { IUser } from '../../../../../core/classes/user.class';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ShowToastrService } from '../../../../../core/services/show-toastr/show-toastr.service';
import { ConfirmationDialogComponent } from '../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { LoggedInUserService } from '../../../../../core/services/loggedInUser/logged-in-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { TaxesShippingService } from '../../../services/taxes-shipping/taxes-shipping.service';
import { CurrencyService } from '../../../../../core/services/currency/currency.service';
import { DialogAddEditTaxesComponent } from '../../../common-dialogs-module/dialog-add-edit-taxes/dialog-add-edit-taxes.component';
import { DialogAddEditOffertProductComponent } from '../../../common-dialogs-module/dialog-add-edit-offert-product/dialog-add-edit-offert-product.component';
import { OffertService } from '../../../services/offert/offert.service';

@Component({
  selector: 'app-offert-table',
  templateUrl: './offert-table.component.html',
  styleUrls: ['./offert-table.component.scss'],
})
export class OffertTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allOffert: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterTax: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  displayedColumns: string[] = ['select', 'name', 'value', 'products', 'fecha', 'Business', 'actions'];
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
    private offerService: OffertService,
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
    this.breadcrumbService.setBreadcrumd('Ofertas', true);

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
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.isLoading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    console.log('OffertTableComponent -> refreshData -> searchvalue', searchvalue);

    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][name][$like]');
    } else {
      this.query.filter.filterText = '';
    }

    this.offerService.getAllOffer(this.query).subscribe(
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
    this.allOffert = data;
    this.dataSource = new MatTableDataSource(this.allOffert);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterTax = true;
  }

  hideSearchForm() {
    this.showFilterTax = false;
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

  ///////Select logic/////////////////

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

  onCreateOffertByCategory(): void {
    let dialogRef: MatDialogRef<DialogAddEditOffertCategoryComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditOffertCategoryComponent, {
      panelClass: 'app-dialog-add-edit-offert-category',
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

  onCreateOffertByProduct() {
    let dialogRef: MatDialogRef<DialogAddEditOffertProductComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditOffertProductComponent, {
      panelClass: 'app-dialog-add-edit-offert-product',
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

  onEditOffer(offer): void {
    let dialogRef: MatDialogRef<DialogAddEditOffertProductComponent, any>;
    this.offerService.getOffert(offer).subscribe(
      (data) => {
        dialogRef = this.dialog.open(DialogAddEditOffertProductComponent, {
          panelClass: 'app-dialog-add-edit-offert-product',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedOffer: data.data,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      },
      (error) => {
        this.utilsService.errorHandle2(error);
      },
    );
  }

  async onRemoveOffers(offers) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar la(s) Oferta(s)?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          this.spinner.show();
          const data = await Promise.all(offers.map((item) => this.offerService.removeOffert(item)));
          this.showToastr.showSucces(this.translate.instant('Ofertas eliminadas exitósamente'), 'Succes', 7500);
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

  showProducts(offer) {
    let s = `Productos:\n`;
    offer.Products.map((item) => {
      s = s + item.name['es'] + ', \n';
    });
    return s;
  }
}
