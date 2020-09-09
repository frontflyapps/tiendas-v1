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
import { DialogAddEditRegionsComponent } from '../dialog-add-edit-regions/dialog-add-edit-regions.component';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { RegionsService } from '../../../services/regions/regions.service';

@Component({
  selector: 'app-regions-table',
  templateUrl: './regions-table.component.html',
  styleUrls: ['./regions-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegionsTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allRegions: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterRegion: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  displayedColumns: string[] = ['select', 'name', 'country', 'alpha2', 'lat', 'lng', 'actions'];
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  isLoading = false;
  /////////////////////////////////////////////////////
  initialPage = 10;
  queryCities: IPagination = {
    limit: this.initialPage,
    total: 0,
    offset: 0,
    order: '-name',
    page: 1,
    filter: { filterText: '', properties: [] },
  };
  searchFilters: any;
  filterForm: FormGroup;

  searchElementCount = 0;
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private regionsService: RegionsService,
    private breadcrumbService: BreadcrumbService,

    private translate: TranslateService,
    public dialog: MatDialog,
    private utilsService: UtilsService,
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
    this.initFilterForm();
    this.refreshData();

    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Regions', true);
    ///////////////////////////////////////////

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.countryChangeForm();
    this.searchChangeForm();

    ///////////////////////////////////////////
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  refreshData(): void {
    this.isLoading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    const filterSearch = { ...this.filterForm.value };
    console.log('RegionsTableComponent -> refreshData -> filterSearch', filterSearch);
    if (filterSearch.CountryId) {
      filterSearch.CountryId = filterSearch.CountryId.id;
    }

    if (searchvalue && searchvalue !== '') {
      this.queryCities.filter.filterText = searchvalue.toString().trim();
      this.queryCities.filter.properties = [];
      this.queryCities.filter.properties.push('filter[$or][name][$like]');
      // this.queryCities.filter.properties.push('filter[$or][Country][name][$like]');
      this.queryCities.filter.properties.push('filter[$or][alpha2][$like]');
    } else {
      this.queryCities.filter.filterText = '';
    }

    this.regionsService.getAllCities(this.queryCities, filterSearch).subscribe(
      (data) => {
        this.initTable(data.data);
        this.selection.clear();
        this.queryCities.total = data.meta.pagination.total;
        this.isLoading = false;
      },
      (error) => {
        this.selection.clear();
        this.isLoading = false;
      },
    );
  }

  getCountries() {
    this.regionsService.getAllCountries(this.queryCountries).subscribe(
      (data) => {
        this.allCountries = data.data;
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  initTable(data) {
    this.allRegions = data;
    this.dataSource = new MatTableDataSource(data);
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      CountryId: [null, []],
    });
  }

  OnPaginatorChange(event) {
    if (event) {
      this.queryCities.limit = event.pageSize || this.initialPage;
      this.queryCities.offset = event.pageIndex * event.pageSize;
      this.queryCities.page = event.pageIndex;
    } else {
      this.queryCities.limit = this.initialPage;
      this.queryCities.offset = 0;
      this.queryCities.page = 1;
    }
    this.refreshData();
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterRegion = true;
  }

  hideSearchForm() {
    this.showFilterRegion = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  countryChangeForm() {
    this.filterForm.controls['CountryId'].valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((val) => {
        if (val && val.length !== 0) {
          if (val.toString().trim() !== '') {
            this.queryCountries.filter = {
              filterText: val.toString().trim(),
              properties: ['filter[$or][name][$like]', 'filter[$or][alpha2][$like]'],
            };
            this.getCountries();
          }
        } else {
          this.queryCountries = {
            limit: 10,
            total: 0,
            offset: 0,
            order: '-name',
            page: 1,
            filter: { filterText: '' },
          };
          this.getCountries();
        }
      });
  }

  searchChangeForm() {
    this.searchForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged(), debounceTime(250))
      .subscribe((val) => {
        if (val.textCtrl.length !== 0) {
          if (val.textCtrl.toString().trim() !== '') {
            this.refreshData();
            this.paginator.firstPage();
          }
        } else {
          this.queryCities = {
            limit: 10,
            offset: 0,
            total: 0,
            page: 0,
            order: '-name',
            filter: {
              filterText: '',
            },
          };
          this.refreshData();
          this.paginator.firstPage();
        }
      });
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

  onCreateRegions(): void {
    let dialogRef: MatDialogRef<DialogAddEditRegionsComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditRegionsComponent, {
      panelClass: 'app-dialog-add-edit-regions',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedRegion: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditRegions(region): void {
    this.regionsService.getCity(region).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogAddEditRegionsComponent, any>;
        dialogRef = this.dialog.open(DialogAddEditRegionsComponent, {
          panelClass: 'app-dialog-add-edit-regions',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedRegion: data.data,
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

  async onRemoveRegions(users) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar la region?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(users.map((item) => this.regionsService.removeCity(item)));
          this.showToastr.showSucces(this.translate.instant('Users successfully removed'), 'Succes', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);

        this.refreshData();
      }
    });
  }
}
