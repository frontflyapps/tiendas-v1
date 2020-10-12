import { IPagination } from './../../../../../core/classes/pagination.class';
import { IUser } from './../../../../../core/classes/user.class';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { environment } from './../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { Product } from './../../../../../modals/product.model';
import { ProductService } from '../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { StateCreatingProductService } from '../../../services/state-creating-product/state-creating-product.service';

@Component({
  selector: 'app-admin-list-product',
  templateUrl: './admin-list-product.component.html',
  styleUrls: ['./admin-list-product.component.scss'],
})
export class AdminListProductComponent implements OnInit, OnDestroy {
  @Input() type: any = null;
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allProducts: Product[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterProduct: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  displayedColumns: string[] = [
    'select',
    'image',
    'name',
    'category',
    'brand',
    'sale',
    'price',
    'stock',
    'isFeatured',
    'actions',
  ];
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  initialPage = 10;
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  language: 'es';
  productCreatingState: any = null;
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
    private productService: ProductService,
    public currencyService: CurrencyService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    private router: Router,
    private showSnackbar: ShowSnackbarService,
    private stateCreatingProduct: StateCreatingProductService,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;

    this._unsubscribeAll = new Subject<any>();
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
    this.productCreatingState = this.stateCreatingProduct.getProductCreated();
  }

  ngOnInit() {
    this.initDisplayColumns();
    this.createSearchForm();
    this.refreshData();

    ///////////////////////////////////////////

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

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
  }

  initDisplayColumns() {
    if (this.type == 'physical') {
      this.displayedColumns = [
        'select',
        'image',
        'name',
        'category',
        'brand',
        'sale',
        'price',
        'stock',
        'isFeatured',
        'Business',
        'actions',
      ];
    } else if (this.type == 'digital') {
      this.displayedColumns = [
        'select',
        'image',
        'name',
        'category',
        'urlReference',
        'urlPreview',
        'previewFormat',
        'price',
        'isFeatured',
        'actions',
        'Business',
      ];
    } else {
      this.displayedColumns = [
        'select',
        'image',
        'name',
        'category',
        'contactInfo',
        'price',
        'isFeatured',
        'Business',
        'actions',
      ];
    }
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
      this.query.filter.properties.push('filter[$or][name][$like]');
      this.query.filter.properties.push('filter[$or][shortDescription][$like]');
      this.query.filter.properties.push('filter[$or][Category][name][$like]');
      // if (this.type == 'physical') {
      //   this.query.filter.properties.push('filter[$or][Physical][Brand][name][$like]');
      // }
    } else {
      this.query.filter.filterText = '';
    }

    this.productService.getAllAdminProducts(this.query, { type: this.type }).subscribe(
      (data) => {
        this.initTable(data.data);
        this.query.total = data.meta.pagination.total;
        this.selection.clear();
        this.isLoading = false;
      },
      (error) => {
        this.selection.clear();
        this.isLoading = false;
      },
    );
  }

  initTable(data) {
    this.allProducts = data;
    this.dataSource = new MatTableDataSource(data);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      textCtrl: ['', [Validators.required]],
    });
  }

  showSearchForm() {
    this.showFilterProduct = true;
  }

  hideSearchForm() {
    this.showFilterProduct = false;
    this.searchForm.controls['textCtrl'].setValue('');
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

  onCreateProduct(): void {
    this.router.navigate(['backend/product/create-product'], { queryParams: { type: this.type } });
  }

  onEditProduct(product): void {
    this.router.navigate(['backend/product/edit-product', product.id]);
  }

  onFinishCreatingProduct(element) {
    this.stateCreatingProduct.setProducCreated(element);
    this.router.navigate(['backend/product/create-product']);
  }

  onMarkAsFeaturedProduct(element) {
    if (element.isFeatured) {
      this.productService.editProduct({ id: element.id, isFeatured: false }).subscribe(
        (data) => {
          this.refreshData();
        },
        (error) => {
          this.utilsService.errorHandle2(error);
        },
      );
    } else {
      this.productService.editProduct({ id: element.id, isFeatured: true }).subscribe(
        (data) => {
          this.refreshData();
        },
        (error) => {
          this.utilsService.errorHandle2(error);
        },
      );
    }
  }

  async onRemoveProduct(products) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el producto?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          await Promise.all(
            products.map((item) => {
              if (this.productCreatingState && item.id == this.productCreatingState.id) {
                localStorage.removeItem('productCreated');
                this.productCreatingState = null;
              }
              return this.productService.removeProduct(item);
            }),
          );
          this.showSnackbar.showSucces(this.translate.instant('Products successfully removed'), 5000);
          this.refreshData();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);
        this.refreshData();
      }
    });
  }
}
