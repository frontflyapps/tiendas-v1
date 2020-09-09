import { IUser } from '../../../../../../core/classes/user.class';
import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName } from '@angular/forms';
import { ShowToastrService } from '../../../../../../core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from '../../../../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from '../../../../../../../environments/environment';
import { ShowSnackbarService } from '../../../../../../core/services/show-snackbar/show-snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-dialog-change-pass',
  templateUrl: './dialog-change-pass.component.html',
  styleUrls: ['./dialog-change-pass.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogChangePassComponent implements OnInit {
  isSaving = false;
  isEditing = false;
  loggedInUser: IUser;
  selectedUser: IUser;
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
  formPass: FormGroup;
  isChangePass = false;
  role: any;
  Roles: any[] = ['Admin', 'Client'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogChangePassComponent>,
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
  }

  createForm(): void {
    this.formPass = this.fb.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        repeat: [null, [Validators.required]],
      },
      { validator: this.matchValidator.bind(this) },
    );
    this.form = this.fb.group({
      password: this.formPass,
      description: [null],
    });
  }

  ngOnDestroy(): void {}

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

  /////////////////////////////////////

  //////////////////////////////////////////

  onUpdatePass(): void {
    this.spinner.show();
    const data = this.form.value;
    data.password = this.formPass.value.password;
    data.PersonId = this.selectedUser.id;
    console.log(data);
    this.userService.changePassUser(data).subscribe(
      (newProfile) => {
        this.showSnackbar.showSucces(this.translate.instant('Contraseña  cambiada exitósamente'));
        this.spinner.hide();
        this.dialogRef.close(true);
      },
      (error) => {
        console.log(error);
        this.utilsService.errorHandle(error, 'User', 'Creating');
        this.spinner.hide();
      },
    );
  }
}
