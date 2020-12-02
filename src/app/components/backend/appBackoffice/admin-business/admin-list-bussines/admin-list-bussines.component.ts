import { BussinessService } from './../../../services/business/business.service';
import { ConfirmationDialogComponent } from '../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { environment } from '../../../../../../environments/environment';
import { ShowToastrService } from '../../../../../core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from '../../../../../core/services/loggedInUser/logged-in-user.service';
import { IPagination } from '../../../../../core/classes/pagination.class';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-list-bussines',
  templateUrl: './admin-list-bussines.component.html',
  styleUrls: ['./admin-list-bussines.component.scss'],
})
export class AdminListBussinesComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allBusiness: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterBusiness: boolean;
  loggedInUser: any;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  displayedColumns: string[] = ['select', 'logo', 'name', 'address', 'contactInfo', 'status', 'actions'];
  isLoading = false;
  initialPage = 10;
  pageSizeOptions: number[] = [this.initialPage, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  language: 'es';

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
    public loggedInUserService: LoggedInUserService,
    private breadcrumbService: BreadcrumbService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    private businessService: BussinessService,
    private showToastr: ShowToastrService,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    console.log('AdminListBussinesComponent -> this.loggedInUser', this.loggedInUser);
    this.imageUrl = environment.imageUrl;
    this._unsubscribeAll = new Subject<any>();
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Nuestros negocios', true);

    this.createSearchForm();
    this.refreshData();

    ///////////////////////////////////////////

    this.searchForm.valueChanges
      .pipe(takeUntil(this._unsubscribeAll), distinctUntilChanged(), debounceTime(250))
      .subscribe((val: any) => {
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
    this.loading = true;
    const searchvalue = this.searchForm.controls['textCtrl'].value;
    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][name][$like]');
    } else {
      this.query.filter.filterText = '';
    }
    this.businessService.getAllBussiness(this.query).subscribe(
      (data) => {
        console.log('AdminListBussinesComponent -> refreshData -> data.data', data.data);
        this.initTable(data.data);
        this.query.total = data.meta.pagination.total;
        this.selection.clear();
        this.loading = false;
      },
      (error) => {
        this.selection.clear();
        this.loading = false;
      },
    );
  }

  initTable(data) {
    this.allBusiness = data;
    this.dataSource = new MatTableDataSource(data);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterBusiness = true;
  }

  hideSearchForm() {
    this.showFilterBusiness = false;
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

  async onRemoveBusiness(brands) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el negocion?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(brands.map((item) => this.businessService.removeBussines(item)));
          this.showToastr.showSucces('Negocio eliminado correctamente', 'Succes', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);
        this.refreshData();
      }
    });
  }

  onCreateBusiness() {
    this.router.navigate(['backend/business/crear']);
  }

  // onChangeStatus(event, id) {
  //   this.isLoading = true;
  //   Promise.resolve()
  //     .then(() => {
  //       if (event) {
  //         return this.businessService.editBussines({ id, status: 'approved' }).toPromise();
  //       } else {
  //         return this.businessService.editBussines({ id, status: 'disabled' }).toPromise();
  //       }
  //     })
  //     .then((userEdited) => {
  //       this.allBusiness[this.allBusiness.findIndex((item) => item.id == userEdited.id)] = userEdited;
  //       this.initTable([...this.allBusiness]);
  //       this.isLoading = false;
  //     })
  //     .catch((error) => {
  //       this.refreshData();
  //       this.isLoading = false;
  //     });
  // }
}
