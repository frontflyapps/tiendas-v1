import { CompressImageService } from '../../../core/services/image/compress-image.service';
import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from '../../../../environments/environment';
import { ShowSnackbarService } from '../../../core/services/show-snackbar/show-snackbar.service';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { ImagePickerConf } from 'guachos-image-picker';
import { IDENTITY_PASSPORT } from '../../../core/classes/regex.const';
import { PhoneCodeService } from '../../../core/services/phone-code/phone-codes.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PhoneCodeService],
})
export class EditProfileComponent implements OnInit {
  innerWidth: any;
  applyStyle = false;
  loggedInUser: any;
  passwordType = 'password';
  form: UntypedFormGroup;
  formPass: UntypedFormGroup;
  defaultImage: '../../../../assets/images/avatars/profile2.png';
  isChangePass = false;

  loadImage = false;
  imageAvatarChange = false;
  showErrorImage = false;
  urlImage = '';
  base64textString = null;
  businessConfig;

  callingCodeDisplayOptions = {
    firthLabel: [
      {
        type: 'path',
        path: ['code'],
      },
    ],
  };
  imageAvatar = null;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '50%',
    language: 'es',
    width: '120px',
    height: '120px',
  };
  startDate = new Date(1985, 1, 1);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: UntypedFormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private authService: AuthenticationService,
    private translate: TranslateService,
    private showSnackbar: ShowSnackbarService,
    private compressImage: CompressImageService,
    public phoneCodesService: PhoneCodeService,
  ) {
    this.urlImage = environment.imageUrl;
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.businessConfig = JSON.parse(localStorage.getItem('business-config'));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: [this.loggedInUser && this.loggedInUser.name ? this.loggedInUser.name : null, [Validators.required]],
      // username: [
      //   this.loggedInUser && this.loggedInUser.username ? this.loggedInUser.username : null,
      //   [Validators.required],
      // ],
      lastName: [
        this.loggedInUser && this.loggedInUser.lastName ? this.loggedInUser.lastName : null,
        [Validators.required],
      ],
      // address: [this.loggedInUser && this.loggedInUser.address ? this.loggedInUser.address : null, []],
      street: [this.loggedInUser && this.loggedInUser.address ? this.loggedInUser.address.street : null, []],
      number: [this.loggedInUser && this.loggedInUser.address ? this.loggedInUser.address.number : null, []],
      between: [this.loggedInUser && this.loggedInUser.address ? this.loggedInUser.address.between : null, []],
      phone: [this.loggedInUser && this.loggedInUser.phone ? this.loggedInUser.phone : null,  this.businessConfig.phoneRequired ? [Validators.required] : []],
      PhoneCallingCodeId: [this.loggedInUser && this.loggedInUser?.PhoneCallingCodeId ? this.loggedInUser?.PhoneCallingCodeId : null, this.businessConfig.phoneRequired ? [Validators.required] : []],
      email: [
        this.loggedInUser && this.loggedInUser.email ? this.loggedInUser.email : null,
        [Validators.required, Validators.email],
      ],
      birthday: [this.loggedInUser && this.loggedInUser.birthday ? this.loggedInUser.birthday : null],
      description: [this.loggedInUser && this.loggedInUser.description ? this.loggedInUser.description : null],
      ci: [this.loggedInUser && this.loggedInUser.ci ? this.loggedInUser.ci : null,
            [Validators.pattern(IDENTITY_PASSPORT),
            Validators.minLength(11),
            Validators.maxLength(11)]]
    });
  }

  matchValidator(group: UntypedFormGroup) {
    const pass = group.controls['password'].value;
    const repeat = group.controls['repeat'].value;
    if (pass === repeat && pass && repeat && pass !== '') {
      return null;
    }
    return {
      mismatch: true,
    };
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

  onUpdateProfile(): void {
    let temp = this.form.value;
    let address = { ...this.form.value };
    delete temp.street;
    delete temp.number;
    delete temp.between;
    const data = temp;
    data.address = {
      street: address.street,
      number: address.number,
      between: address.between,
    };
    if (this.imageAvatarChange) {
      data.avatar = this.imageAvatar;
    }
    if (this.isChangePass) {
      data.password = this.formPass.value.password;
    } else {
      delete data.password;
    }
    // data.id = this.loggedInUser.id;
    console.log(data, '*****');
    this.spinner.show();
    this.authService.editProfile(data).subscribe(
      (newProfile) => {
        this.loggedInUserService.setNewProfile(newProfile.data);
        this.showSnackbar.showSucces(this.translate.instant('Profile updated successfully'));
        this.spinner.hide();
        this.dialogRef.close(true);
      },
      (error) => {
        console.warn(error);
        this.utilsService.errorHandle(error, 'User', 'Editing');
        this.spinner.hide();
      },
    );
  }

  /////////////////////////////////////

  onImageChange(dataUri) {
    this.imageAvatar = dataUri;
    this.imageAvatarChange = true;
  }
}
