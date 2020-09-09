import { IPagination } from './../../../../../core/classes/pagination.class';
import { IUser } from './../../../../../core/classes/user.class';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from './../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { TaxesShippingService } from '../../../services/taxes-shipping/taxes-shipping.service';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { DialogAddEditTaxesComponent } from '../../../common-dialogs-module/dialog-add-edit-taxes/dialog-add-edit-taxes.component';

@Component({
  selector: 'app-taxes-table',
  templateUrl: './taxes-table.component.html',
  styleUrls: ['./taxes-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaxesTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allTaxes: any[] = [];
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
  displayedColumns: string[] = ['select', 'name', 'country-code', 'product', 'price', 'description', 'actions'];
  pageSizeOptions: number[] = [25, 50, 100, 250];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private taxesShippingService: TaxesShippingService,
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
    this.refreshData();
    this.createSearchForm();

    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Taxes', true);

    this.searchForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((val) => {
      this.spinner.show();
      const data = this.filterTaxes(val.textCtrl);
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinner.hide();
    });

    ///////////////////////////////////////////

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    ///////////////////////////////////////////
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.taxesShippingService.getAllTaxes({ limit: 0, offset: 0, order: 'createdAt' }).subscribe(
      (data) => {
        this.initTable(data.data);
        this.searchElementCount = data.meta.total;
        this.selection.clear();
      },
      (error) => {
        this.utilsService.errorHandle(error);
        this.selection.clear();
      },
    );
  }

  initTable(data) {
    this.allTaxes = data;
    let filteredData = this.filterTaxes(this.searchForm.value.textCtrl || '');
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  filterTaxes(searchValue: string) {
    let temp = this.allTaxes.filter((tax) => this._filterTaxes(tax, searchValue));
    return temp;
  }

  private _filterTaxes(tax, searchValue) {
    const nameParams = tax.name['es'] || '';
    // console.log('TaxesTableComponent -> _filterTaxes -> nameParams', nameParams);
    const price = tax.price + '';
    // console.log('TaxesTableComponent -> _filterTaxes -> price', price);
    const country = tax.Country.name['es'] || '';
    // console.log('TaxesTableComponent -> _filterTaxes -> country', country);

    return (
      nameParams.toLowerCase().trim().indexOf(searchValue.toLowerCase().trim()) >= 0 ||
      price.toLowerCase().trim().indexOf(searchValue.toLowerCase().trim()) >= 0 ||
      country.toLowerCase().trim().indexOf(searchValue.toLowerCase().trim()) >= 0
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

  onCreateTax(): void {
    let dialogRef: MatDialogRef<DialogAddEditTaxesComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditTaxesComponent, {
      panelClass: 'app-dialog-add-edit-taxes',
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

  onEditTax(tax): void {
    let dialogRef: MatDialogRef<DialogAddEditTaxesComponent, any>;
    this.taxesShippingService.getTax(tax).subscribe(
      (data) => {
        dialogRef = this.dialog.open(DialogAddEditTaxesComponent, {
          panelClass: 'app-dialog-add-edit-taxes',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedTax: data.data,
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

  async onRemoveTaxes(users) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el Tax?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          this.spinner.show();
          const data = await Promise.all(users.map((item) => this.taxesShippingService.removeTax(item)));
          this.showToastr.showSucces(this.translate.instant('Taxes successfully removed'), 'Succes', 7500);
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
}
