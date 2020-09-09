import { Product } from './../../../../../modals/product.model';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from './../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { DialogAddEditBrandComponent } from './dialog-add-edit-brand/dialog-add-edit-brand.component';
import { CategoriesService } from '../../../services/categories/catagories.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { CompressImageService } from './../../../../../core/services/image/compress-image.service';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-admin-list-brands',
  templateUrl: './admin-list-brands.component.html',
  styleUrls: ['./admin-list-brands.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminListBrandsComponent implements OnInit, OnDestroy {
  @Input() role;
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allBrands: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterBrand: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  displayedColumns: string[] = ['select', 'image', 'name', 'model', 'description', 'actions'];
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  language: 'es';

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private productService: ProductService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    private categoriesService: CategoriesService,
    private showToastr: ShowToastrService,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;
    this._unsubscribeAll = new Subject<any>();
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Brands', true);

    this.refreshData();
    this.createSearchForm();

    this.searchForm.valueChanges.subscribe((val) => {
      const data = this.filterBrands(val.textCtrl);
      this.dataSource = new MatTableDataSource<Product>(data);
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
    this.selection.clear();
    this.categoriesService.getAllBrands({ limit: 0, offset: 0 }).subscribe(
      (data) => {
        console.log('TCL: AdminListProductComponent -> data', data);
        this.initTable(data.data);
        this.selection.clear();
      },
      (error) => {
        this.utilsService.errorHandle(error);
        this.selection.clear();
      },
    );
  }

  initTable(data) {
    this.allBrands = data;
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
    this.showFilterBrand = true;
  }

  hideSearchForm() {
    this.showFilterBrand = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  filterBrands(searchValue: string) {
    const temp = this.allBrands.filter((brand) => this._filterBrand(brand, searchValue));
    return temp;
  }

  private _filterBrand(brand, searchValue) {
    const nameParams = brand.name[this.language] ? brand.name[this.language] : brand.name['es'];
    const modelParams = brand.model[this.language] ? brand.model[this.language] : brand.model['es'];
    return (
      nameParams.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
      modelParams.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
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

  onCreateBrand(): void {
    let dialogRef: MatDialogRef<DialogAddEditBrandComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditBrandComponent, {
      panelClass: 'app-dialog-add-edit-brand',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedBrand: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  onEditBrand(brand): void {
    let dialogRef: MatDialogRef<DialogAddEditBrandComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditBrandComponent, {
      panelClass: 'app-dialog-add-edit-brand',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: true,
        selectedBrand: brand,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }

  async onRemoveBrand(brands) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el brand?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(brands.map((item) => this.categoriesService.removeBrand(item)));
          this.showToastr.showSucces(this.translate.instant('Brands successfully removed'), 'Succes', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);
        this.refreshData();
      }
    });
  }
}
