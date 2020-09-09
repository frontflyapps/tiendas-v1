import { ContactUsService } from './../../../services/contact-us/contact-us.service';
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
import { DialogEditMessagesComponent } from '../dialog-edit-messages/dialog-edit-messages.component';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-admin-contact-us-table',
  templateUrl: './admin-contact-us-table.component.html',
  styleUrls: ['./admin-contact-us-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminContactUsTableComponent implements OnInit, OnDestroy {
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allMessages: any[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterMessages: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  language: 'es';
  displayedColumns: string[] = ['select', 'name', 'email', 'message', 'status', 'date', 'actions'];
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  query: IPagination = {
    limit: 0,
    offset: 0,
    order: '-createdAt',
    filter: {
      filterText: null,
      properties: [],
    },
  };

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    private contactUseService: ContactUsService,
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
    this.refreshData();
    this.createSearchForm();

    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Messages', true);

    this.searchForm.valueChanges.subscribe((val) => {
      const data = this.filterMessages(val.textCtrl);
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
    this.contactUseService.getAllMessages(this.query).subscribe(
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
    this.allMessages = data;
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
    this.showFilterMessages = true;
  }

  hideSearchForm() {
    this.showFilterMessages = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  filterMessages(searchValue: string) {
    let temp = this.allMessages.filter((region) => this._filterFnMessages(region, searchValue));
    return temp;
  }

  private _filterFnMessages(message, searchValue) {
    return (
      message.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
      message.email.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
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

  onEditMessages(message): void {
    this.contactUseService.getContactUs(message).subscribe(
      (data) => {
        let dialogRef: MatDialogRef<DialogEditMessagesComponent, any>;
        dialogRef = this.dialog.open(DialogEditMessagesComponent, {
          panelClass: 'app-dialog-edit-messages',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedMessage: data.data,
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

  async onRemoveMessages(mesages) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: this.translate.instant('Confirmation'),
        question: this.translate.instant('Are you sure you want to delete the messages?'),
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(mesages.map((item) => this.contactUseService.removeContactUs(item)));
          this.showToastr.showSucces(this.translate.instant('Messages successfully removed'), 'Succes', 7500);
          this.refreshData();
        }
      } catch (error) {
        this.utilsService.errorHandle(error);

        this.refreshData();
      }
    });
  }
}
