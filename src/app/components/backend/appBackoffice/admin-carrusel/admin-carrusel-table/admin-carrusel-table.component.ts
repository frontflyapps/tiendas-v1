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
import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { environment } from './../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { DialogEditCarruselsComponent } from '../dialog-edit-carrusels/dialog-edit-carrusels.component';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { CarruselService } from '../../../services/carrusel/carrusel.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-admin-carrusel-table',
  templateUrl: './admin-carrusel-table.component.html',
  styleUrls: ['./admin-carrusel-table.component.scss'],
})
export class AdminCarruselTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allCarruels: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterCarrusel: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  displayedColumns: string[] = ['select', 'image', 'title', 'colorTitle', 'subtitle', 'link', 'actions'];
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
    private carruselService: CarruselService,
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
    this.breadcrumbService.setBreadcrumd('Carrusels', true);

    this.searchForm.valueChanges.subscribe((val) => {
      const data = this.filterCarrusels(val.textCtrl);
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
    this.carruselService.getAllCarrusels(this.query).subscribe(
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
    this.allCarruels = data;
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
    this.showFilterCarrusel = true;
  }

  hideSearchForm() {
    this.showFilterCarrusel = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  filterCarrusels(searchValue: string) {
    let temp = this.allCarruels.filter((carrusel) => this._filterFnCarrusels(carrusel, searchValue));
    return temp;
  }

  private _filterFnCarrusels(carrusel, searchValue) {
    return (
      JSON.stringify(carrusel.title).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
      JSON.stringify(carrusel.subTitle).toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
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

  onCreateCarrusel(): void {
    let dialogRef: MatDialogRef<DialogEditCarruselsComponent, any>;
    dialogRef = this.dialog.open(DialogEditCarruselsComponent, {
      panelClass: 'app-dialog-edit-carrusels',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedCarrusel: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditCarrusel(carrusel): void {
    this.carruselService.getCarrusel(carrusel).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogEditCarruselsComponent, any>;
        dialogRef = this.dialog.open(DialogEditCarruselsComponent, {
          panelClass: 'app-dialog-edit-carrusels',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedCarrusel: data.data,
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

  async onRemoveCarrusels(banners) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: this.translate.instant('Confirmation'),
        question: this.translate.instant('Are you sure you want to delete the banners?'),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(banners.map((item) => this.carruselService.removeCarrusel(item)));
          this.showToastr.showSucces(this.translate.instant('Banner successfully removed'), 'Succes', 7500);
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
      this.carruselService.editCarrusel({ id: element.id, isActive: false }).subscribe(
        (data) => {
          this.refreshData();
        },
        (error) => {
          this.utilsService.errorHandle2(error);
        },
      );
    } else {
      this.carruselService.editCarrusel({ id: element.id, isActive: true }).subscribe(
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
