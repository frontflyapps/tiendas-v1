import { UserService } from './../../../../services/user/user.service';
import { ShowSnackbarService } from './../../../../../../core/services/show-snackbar/show-snackbar.service';
import { ShowToastrService } from './../../../../../../core/services/show-toastr/show-toastr.service';
import { IUser } from './../../../../../../core/classes/user.class';
import { IPagination } from './../../../../../../core/classes/pagination.class';
import { debounceTime } from 'rxjs/operators';
import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from './../../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { LoggedInUserService } from './../../../../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from './../../../../../../core/services/utils/utils.service';
import { DialogAddEditUserComponent } from '../dialog-add-edit-user/dialog-add-edit-user.component';
import { DialogAddEditMessengerComponent } from '../dialog-add-edit-mesenger/dialog-add-edit-mesenger.component';
import { DialogChangePassComponent } from '../dialog-change-pass/dialog-change-pass.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  @Input() role;
  urlImage: string;
  innerWidth: any;
  applyStyle = false;
  allUsers: IUser[] = [];
  searchForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  showFilterUser: boolean;
  loggedInUser: IUser;
  loading = false;
  _unsubscribeAll: Subject<any>;
  selection: SelectionModel<any>;
  imageUrl: any;
  showActionsBtn = false;
  displayedColumns: string[] = [
    'select',
    'avatar',
    'name',
    'lastName',
    'email',
    'username',
    'status',
    'Business',
    'actions',
  ];
  pageSizeOptions: number[] = [10, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  languages: { name: string; image: string; lang: string }[];
  language: any;

  constructor(
    private fb: FormBuilder,
    private loggedInUserService: LoggedInUserService,
    public userService: UserService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private showToastr: ShowToastrService,
    public utilsService: UtilsService,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel<any>(true, []);
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.imageUrl = environment.imageUrl;
    console.log('TCL: UserTableComponent -> environment.imageUrl', this.imageUrl);
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.updateDisplayColumnsData();
    this.refreshData();
    this.createSearchForm();

    this.searchForm.valueChanges.subscribe((val) => {
      const data = this.filterUsersByName(val.textCtrl);
      this.dataSource = new MatTableDataSource<IUser>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  refreshData(): void {
    if (this.role === 'Messenger') {
      this.userService.getAllMEssengers({ limit: 0, offset: 0 }, { role: this.role }).subscribe(
        (data) => {
          data.data = [
            ...data.data.map((item) => {
              item.name = item.Person.name;
              item.lastName = item.Person.lastName;
              item.email = item.Person.email;
              item.username = item.Person.username;
              item.status = item.Person.status;
              return item;
            }),
          ];
          this.initTable(data.data);
          this.searchElementCount = data.meta.total;
          this.selection.clear();
        },
        (error) => {
          this.selection.clear();
        },
      );
    } else {
      this.userService.getAllUsers({ limit: 0, offset: 0 }, { role: this.role }).subscribe(
        (data) => {
          this.initTable(data.data);
          this.searchElementCount = data.meta.total;
          this.selection.clear();
        },
        (error) => {
          this.selection.clear();
        },
      );
    }

    // let users = [
    //   { avatar: null, name: 'Jose', lastName: 'Alejandro', email: 'jalejandro2928@gmail.com', username: 'jalejandro2928' },
    //   { avatar: null, name: 'Pedro', lastName: 'Gonzales', email: 'pedro@gmail.com', username: 'pedro2928' },
    //   { avatar: null, name: 'Joaquin', lastName: 'Amigo', email: 'jamigo@gmail.com', username: 'jpm28' },
    //   { avatar: null, name: 'Jose', lastName: 'Perez', email: 'garcia@gmail.com', username: 'jnuipo28' }];
    // this.initTable(users);
  }

  initTable(data) {
    this.allUsers = data;
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
    this.showFilterUser = true;
  }

  hideSearchForm() {
    this.showFilterUser = false;
    this.searchForm.controls['textCtrl'].setValue('');
  }

  filterUsersByName(name: string) {
    let temp = this.allUsers.filter(
      (user) =>
        user.username.toLowerCase().indexOf(name.toLowerCase()) >= 0 ||
        (user.name && user.name.toLowerCase().indexOf(name.toLowerCase()) >= 0) ||
        (user.lastName && user.lastName.toLowerCase().indexOf(name.toLowerCase()) >= 0) ||
        (user.email && user.email.toLowerCase().indexOf(name.toLowerCase()) >= 0),
    );
    this.searchElementCount = temp.length;
    return temp;
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

  onCreateUser(): void {
    if (this.role === 'Messenger') {
      let dialogRef: MatDialogRef<DialogAddEditMessengerComponent, any>;
      dialogRef = this.dialog.open(DialogAddEditMessengerComponent, {
        panelClass: 'app-dialog-add-edit-mesenger',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          isEditing: false,
          selectedMessenger: null,
          role: this.role,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.refreshData();
      });
    } else {
      let dialogRef: MatDialogRef<DialogAddEditUserComponent, any>;
      dialogRef = this.dialog.open(DialogAddEditUserComponent, {
        panelClass: 'app-dialog-add-edit-user',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          isEditing: false,
          selectedUser: null,
          role: this.role,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.refreshData();
      });
    }
  }

  onEditUser(person): void {
    if (this.role === 'Messenger') {
      let dialogRef: MatDialogRef<DialogAddEditMessengerComponent, any>;
      this.userService.getMEssenger(person).subscribe((data) => {
        dialogRef = this.dialog.open(DialogAddEditMessengerComponent, {
          panelClass: 'app-dialog-add-edit-mesenger',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedMessenger: data.data,
            role: this.role,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      });
    } else {
      let dialogRef: MatDialogRef<DialogAddEditUserComponent, any>;
      this.userService.getUser(person).subscribe((data) => {
        dialogRef = this.dialog.open(DialogAddEditUserComponent, {
          panelClass: 'app-dialog-add-edit-user',
          maxWidth: '100vw',
          maxHeight: '100vh',
          data: {
            isEditing: true,
            selectedUser: data.data,
            role: this.role,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.refreshData();
        });
      });
    }
  }

  async onRemoveUser(users) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el usuario?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          if (this.role === 'Messenger') {
            const data = await Promise.all(users.map((item) => this.userService.removeMEssenger(item)));
            this.showToastr.showSucces(this.translate.instant('Messengers successfully removed'), 'Succes', 7500);
            this.refreshData();
          } else {
            const data = await Promise.all(users.map((item) => this.userService.removeUser(item)));
            this.showToastr.showSucces(this.translate.instant('Users successfully removed'), 'Succes', 7500);
            this.refreshData();
          }
        }
      } catch (error) {
        this.refreshData();
      }
    });
  }

  updateDisplayColumnsData() {
    if (this.role === 'Messenger') {
      this.displayedColumns = [
        'select',
        'avatar',
        'fullName',
        'email',
        'username',
        'dni',
        'countries',
        'status',
        'Business',
        'actions',
      ];
    }
  }

  changePass(user) {
    let dialogRef: MatDialogRef<DialogChangePassComponent, any>;
    dialogRef = this.dialog.open(DialogChangePassComponent, {
      panelClass: 'app-dialog-change-pass',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        selectedUser: user,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData();
    });
  }
}
