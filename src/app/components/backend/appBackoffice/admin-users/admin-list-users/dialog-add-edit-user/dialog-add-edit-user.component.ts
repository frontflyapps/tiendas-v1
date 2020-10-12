import { IUser } from '../../../../../../core/classes/user.class';
import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName } from '@angular/forms';
import { ShowToastrService } from './../../../../../../core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from './../../../../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../../../../environments/environment';
import { ShowSnackbarService } from './../../../../../../core/services/show-snackbar/show-snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from './../../../../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './../../../../services/user/user.service';

@Component({
  selector: 'app-dialog-add-edit-user',
  templateUrl: './dialog-add-edit-user.component.html',
  styleUrls: ['./dialog-add-edit-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditUserComponent implements OnInit {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedUser: any;
  loadImage = false;
  imageAvatarChange = false;
  showErrorImage = false;
  urlImage = 'data:image/jpeg;base64,';
  base64textString = null;
  imageAvatar = null;
  innerWidth: any;
  applyStyle = false;
  passwordType = 'password';
  form: FormGroup;
  permitsForm: FormGroup;
  formPass: FormGroup;
  isChangePass = false;
  role: any;
  Roles: any[] = ['Admin', 'Client'];
  localDatabaseUsers = environment.localDatabaseUsers;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditUserComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private userService: UserService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.urlImage = environment.apiUrl;
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.isEditing = data.isEditing;
    this.role = data.role;
    this.selectedUser = data.selectedUser;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (this.role == 'Admin') {
      this.Roles = ['Admin', 'Client'];
    } else if (this.role == 'Owner') {
      this.Roles = ['Owner'];
    } else if (this.role == 'Client') {
      this.Roles = ['Client'];
    }
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        name: [this.selectedUser && this.selectedUser.name ? this.selectedUser.name : null, [Validators.required]],
        username: [
          this.selectedUser && this.selectedUser.username ? this.selectedUser.username : null,
          [Validators.required],
        ],
        lastName: [
          this.selectedUser && this.selectedUser.lastName ? this.selectedUser.lastName : null,
          [Validators.required],
        ],
        address: [this.selectedUser && this.selectedUser.address ? this.selectedUser.address : null, []],
        phone: [this.selectedUser && this.selectedUser.phone ? this.selectedUser.phone : null, []],
        email: [
          this.selectedUser && this.selectedUser.email ? this.selectedUser.email : null,
          [Validators.required, Validators.email],
        ],
        description: [this.selectedUser && this.selectedUser.description ? this.selectedUser.description : null],
        roles: [
          this.selectedUser && this.selectedUser.roles ? this.selectedUser.roles.map((item) => item.type) : null,
          [Validators.required],
        ],
      });
      this.permitsForm = this.fb.group({
        canCreateProduct: [this.selectedUser?.Workers[0]?.canCreateProduct, [Validators.required]],
        canCreatePerson: [this.selectedUser?.Workers[0]?.canCreatePerson, [Validators.required]],
        canDelivery: [this.selectedUser?.Workers[0]?.canDelivery, [Validators.required]],
        canPublish: [this.selectedUser?.Workers[0]?.canPublish, [Validators.required]],
        canCancel: [this.selectedUser?.Workers[0]?.canCancel, [Validators.required]],
        canCreateOffer: [this.selectedUser?.Workers[0]?.canCreateOffer, [Validators.required]],
        canEditBusiness: [this.selectedUser?.Workers[0]?.canEditBusiness, [Validators.required]],
        canCreateShipping: [this.selectedUser?.Workers[0]?.canCreateShipping, [Validators.required]],
      });
      if (this.selectedUser.avatar) {
        this.base64textString = this.selectedUser.avatar;
        this.imageAvatar = this.urlImage + this.base64textString;
        this.loadImage = true;
      }
    } else {
      this.formPass = this.fb.group(
        {
          password: [null, [Validators.required, Validators.minLength(6)]],
          repeat: [null, [Validators.required]],
        },
        { validator: this.matchValidator.bind(this) },
      );
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        username: [null, []],
        address: [null, []],
        phone: [null, []],
        email: [null, [Validators.required, Validators.email]],
        password: this.formPass,
        description: [null],
        roles: [[this.role], [Validators.required]],
      });
      this.permitsForm = this.fb.group({
        canCreateProduct: [true, [Validators.required]],
        canCreatePerson: [false, [Validators.required]],
        canDelivery: [false, [Validators.required]],
        canPublish: [false, [Validators.required]],
        canCancel: [false, [Validators.required]],
        canCreateOffer: [true, [Validators.required]],
        canEditBusiness: [false, [Validators.required]],
        canCreateShipping: [false, [Validators.required]],
      });
    }
  }

  matchValidator(group: FormGroup) {
    const pass = group.controls['password'].value;
    const repeat = group.controls['repeat'].value;
    if (pass === repeat && pass && repeat && pass !== '') {
      return null;
    } else if (!pass && !repeat) {
      return null;
    } else {
      return {
        mismatch: true,
      };
    }
  }

  onSelectSliderChange(event) {
    if (this.isChangePass) {
      this.isChangePass = false;
      this.form.removeControl('password');
    } else {
      this.isChangePass = true;
      this.formPass = this.fb.group(
        {
          password: [null, [Validators.required]],
          repeat: [null, [Validators.required]],
        },
        { validator: this.matchValidator.bind(this) },
      );
      this.form.addControl('password', this.formPass);
    }
    this.form.updateValueAndValidity();
  }

  /////////////////////////////////////

  // kike
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files[0].size < 500000) {
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorImage = true;
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.urlImage = 'data:image/jpeg;base64,';
    this.imageAvatar = this.urlImage + this.base64textString;
    this.loadImage = true;
    this.showErrorImage = false;
    this.imageAvatarChange = true;
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  //////////////////////////////////////////

  onUpdateProfile(): void {
    this.spinner.show();
    const data = this.form.value;
    if (this.imageAvatarChange) {
      data.avatar = this.imageAvatar;
    }
    if (!this.isEditing) {
      data.password = this.formPass.value.password;
      if (!this.localDatabaseUsers) {
        data.username = data.email;
      }
      data.permits = { ...this.permitsForm.value };
      // console.log(data);
      this.userService.createUser(data).subscribe(
        (newProfile) => {
          this.showSnackbar.showSucces(this.translate.instant('User successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          // this.utilsService.errorHandle(error, 'User', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data.id = this.selectedUser.id;
      data.permits = { ...this.permitsForm.value };
      this.userService.editUser(data).subscribe(
        (newProfile) => {
          if (newProfile.id === this.loggedInUser.id) {
            this.loggedInUserService.setNewProfile(newProfile.data);
          }
          this.showSnackbar.showSucces(this.translate.instant('Profile updated successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          // this.utilsService.errorHandle(error, 'User', 'Editing');
          this.spinner.hide();
        },
      );
    }
  }
}
