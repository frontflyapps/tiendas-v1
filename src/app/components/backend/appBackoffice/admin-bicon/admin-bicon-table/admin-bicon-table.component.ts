import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { IPagination } from './../../../../../core/classes/pagination.class';
import { IUser } from './../../../../../core/classes/user.class';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { environment } from './../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { DialogEditBiconComponent } from '../dialog-edit-bicon/dialog-edit-bicon.component';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { BiconService } from '../../../services/bicon/bicon.service';

@Component({
  selector: 'app-admin-bicon-table',
  templateUrl: './admin-bicon-table.component.html',
  styleUrls: ['./admin-bicon-table.component.scss'],
})
export class AdminBiconTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allBicon: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterBicons: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  displayedColumns: string[] = ['select', 'icon', 'title', 'subtitle', 'date', 'actions'];
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;

  query: IPagination = {
    limit: 0,
    offset: 0,
    order: '-updatedAt',
    filter: {
      filterText: null,
      properties: [],
    },
  };

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private biconService: BiconService,
    private breadcrumbService: BreadcrumbService,

    private translate: TranslateService,
    public dialog: MatDialog,
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
    this.breadcrumbService.setBreadcrumd('Bicons', true);

    this.searchForm.valueChanges.subscribe((val) => {
      const data = this.filterBicons(val.textCtrl);
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    this.isLoading = true;
    console.log('datarasdasd');
    this.biconService.getAllBicons(this.query).subscribe(
      (data) => {
        this.initTable(data.data);
        this.searchElementCount = data.meta.total;
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
    this.allBicon = data;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterBicons = true;
  }

  hideSearchForm() {
    this.showFilterBicons = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  filterBicons(searchValue: string) {
    let temp = this.allBicon.filter((bicon) => this._filterFnBicons(bicon, searchValue));
    return temp;
  }

  private _filterFnBicons(bicon, searchValue) {
    return (
      JSON.stringify(bicon.title).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
      JSON.stringify(bicon.subTitle).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
      bicon.icon.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
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

  onCreateBicon(): void {
    let dialogRef: MatDialogRef<DialogEditBiconComponent, any>;
    dialogRef = this.dialog.open(DialogEditBiconComponent, {
      panelClass: 'app-dialog-edit-bicon',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedBicon: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditBicon(carrusel): void {
    this.biconService.getBicon(carrusel).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogEditBiconComponent, any>;
        dialogRef = this.dialog.open(DialogEditBiconComponent, {
          panelClass: 'app-dialog-edit-bicon',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedBicon: data.data,
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

  async onRemoveBicons(banners) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: this.translate.instant('Confirmation'),
        question: this.translate.instant('Are you sure you want to delete the bicons?'),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(banners.map((item) => this.biconService.removeBicon(item)));
          this.showToastr.showSucces(this.translate.instant('Bicons successfully removed'), 'Succes', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);

        this.refreshData();
      }
    });
  }

  onMarkAsActiveBanner(element) {
    if (element.isActive) {
      this.biconService.editBicon({ id: element.id, isActive: false }).subscribe(
        (data) => {
          this.refreshData();
        },
        (error) => {
          this.utilsService.errorHandle2(error);
        },
      );
    } else {
      this.biconService.editBicon({ id: element.id, isActive: true }).subscribe(
        (data) => {
          this.refreshData();
        },
        (error) => {
          this.utilsService.errorHandle2(error);
        },
      );
    }
  }
}
