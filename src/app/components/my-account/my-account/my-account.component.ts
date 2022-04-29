import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from '../../../core/services/show-snackbar/show-snackbar.service';
import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { CUBAN_PHONE_START_5, EMAIL_REGEX, PASS_CLIENT_REGEX } from '../../../core/classes/regex.const';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyAccountComponent implements OnInit {
  innerWidth: any;
  passType = 'password';
  passType2 = 'password';
  applyStyle = false;
  configuration: any = {};
  message: string;
  redirectToOriginPage: string;
  paramsToRedirect: any;
  urlToRedirect: any;
  inLoading = false;
  loginForm: FormGroup;
  formPass: FormGroup;
  fromPassRegister: FormGroup;
  pinForm: FormGroup;
  activateForm: FormGroup;
  registrationForm: FormGroup;
  insertEmailPassForm: FormGroup;
  changeToNewPassForm: FormGroup;

  pdfData: any[] = [];
  selectedDocument = false;

  showLoginForm = true;
  showRegistrationForm = false;
  showPinForm = false;
  showActivateForm = false;
  showResetPassForm = false;
  showNewPassForm = false;
  queryParams = null;
  language = null;
  isRegisterToPay = false;
  isRegisterToBecomeASeller = false;
  routeToNavigate = '/checkout';
  localDatabaseUsers = environment.localDatabaseUsers;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  constructor(
    public authService: AuthenticationService,
    private toastr: ShowToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private showSnackbar: ShowSnackbarService,
    private loggedInUserService: LoggedInUserService,
    public utilsService: UtilsService,
  ) {
    this.message = '';
    this.isRegisterToPay = !!localStorage.getItem('isRegisterToPay');
    this.isRegisterToBecomeASeller = !!localStorage.getItem('isRegisterToBecomeASeller');
    localStorage.removeItem('isRegisterToPay');
    localStorage.removeItem('isRegisterToBecomeASeller');
    this.routeToNavigate = this.isRegisterToPay ? '/cart' : this.isRegisterToBecomeASeller ? '/become-a-seller' : '';

    this.createForm();
    this.createRegistrationForm();
    this.createValidationForm();
    this.createChangePassForm();
    this.createNewPassForm();
    this.createActivateForm();

    this.getParamsAndInspect();
  }

  /**
   * ====================================================
   * Check Params and redirect to view on my-account
   */
  getParamsAndInspect() {
    const params = this.route.queryParams;
    this.paramsVerifyPositionModal(params);
    this.route.queryParams.subscribe((data) => {
      this.paramsVerifyPositionModal(data);
      this.redirectToOriginPage = data.redirectToOriginPage;
      this.paramsToRedirect = data.paramsToRedirect;
      this.urlToRedirect = data.urlToRedirect;
    });
  }

  paramsVerifyPositionModal(data) {
    const viewPositionOfModal = {
      registration: () => this.onShowRegistration(),
      password: () => this.onChangePass(),
      validate: () => this.onShowActivate(),
    };

    if (data?.modal) {
      try {
        viewPositionOfModal[data?.modal]();
      } catch (e) {
        this.router.navigate(['/my-account']).then(() => {
          console.warn('Modal with Error, data.modal:', data?.modal);
        });
      }
    }
  }

  /**
   * Check Params and redirect to view on my-account
   * ====================================================
   */

  showPass() {
    if (this.passType === 'password') {
      this.passType = 'text';
    } else {
      this.passType = 'password';
    }
  }

  showPass2() {
    if (this.passType2 === 'password') {
      this.passType2 = 'text';
    } else {
      this.passType2 = 'password';
    }
  }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.checkQueryParams();
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  checkQueryParams() {
    if (this.queryParams.modal == 'validate' && this.queryParams.pin && this.queryParams.email) {
      this.pinForm.controls['pin'].setValue(this.queryParams.pin);
      this.registrationForm.controls['email'].setValue(this.queryParams.email);
      if (this.pinForm.valid && this.registrationForm.controls['email'].valid) {
        this.onSetValidationPin();
        this.spinner.show();
        setTimeout(() => {
          this.onCheckPin();
        });
      } else {
        this.showSnackbar.showError(
          this.translate.instant('The email or pin are invalid the validation accont is going to fail'),
          8000,
        );
      }
    } else if (this.queryParams.modal == 'password' && this.queryParams.pin && this.queryParams.email) {
      this.showRegistrationForm = false;
      this.showPinForm = false;
      this.showResetPassForm = false;
      this.showLoginForm = false;
      this.showNewPassForm = true;
      this.inLoading = false;
      this.changeToNewPassForm.controls['pin'].setValue(this.queryParams.pin);
      this.insertEmailPassForm.value.email = this.queryParams.email;
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.pattern(/^\w((?!\s{2}).)*/)]],
      password: [null, [Validators.required]],
    });
  }

  createRegistrationForm() {
    this.fromPassRegister = this.fb.group(
      {
        password: [null, [Validators.required, Validators.pattern(PASS_CLIENT_REGEX)]],
        repeat: [null, [Validators.required, Validators.pattern(PASS_CLIENT_REGEX)]],
      },
      { validator: this.matchValidator.bind(this) },
    );

    this.registrationForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(/^\w((?!\s{2}).)*/)]],
      lastname: [null, [Validators.required, Validators.pattern(/^\w((?!\s{2}).)*/)]],
      // username: [null, [
      //   Validators.required,
      //   Validators.pattern(USERNAME),
      // ]],
      phone: [null, [Validators.pattern(CUBAN_PHONE_START_5), Validators.minLength(8), Validators.maxLength(8)]],
      address: [null, []],
      email: [null, [Validators.required, Validators.email, Validators.pattern(EMAIL_REGEX)]],
      // recaptcha: ['', Validators.required],
      passwords: this.fromPassRegister,
    });
    // this.registrationForm.markAllAsTouched();
  }

  createValidationForm() {
    this.pinForm = this.fb.group({
      pin: [null, [Validators.required]],
    });
  }

  createChangePassForm() {
    this.insertEmailPassForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  createActivateForm() {
    this.activateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      pin: [null, [Validators.required]],
    });
  }

  createNewPassForm() {
    this.formPass = this.fb.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        repeat: [null, [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.matchValidator.bind(this) },
    );

    this.changeToNewPassForm = this.fb.group({
      pin: [null, [Validators.required]],
      passwords: this.formPass,
    });
  }

  login(username: string, password: string) {
    this.inLoading = true;
    this.spinner.show();
    this.authService.login(username, password).subscribe(
      (value: any) => {
        const data = value.data;
        if (data) {
          this.loggedInUserService.saveAccountCookie(data.Authorization);
          this.loggedInUserService.updateUserProfile(data.profile);

          this.toastr.showInfo(
            this.translate.instant('You have successfully logged into our system'),
            this.translate.instant('User login'),
            10000,
          );
          this.inLoading = false;
          /** Redirect to origin page **/
          if (this.redirectToOriginPage) {
            if (this.paramsToRedirect) {
              let tempParams = JSON.parse(this.paramsToRedirect);
              this.router
                .navigate([this.redirectToOriginPage], {
                  queryParams: { ...tempParams.params },
                })
                .then();
            } else {
              this.router.navigate([this.redirectToOriginPage]).then();
            }
          }
          /** Redirect to URL when login **/
          if (this.urlToRedirect) {
            this.router.navigate([this.urlToRedirect]);
          } else {
            this.router.navigate([this.routeToNavigate]).then();
          }
          this.spinner.hide();
        } else {
          this.toastr.showError(this.translate.instant('Wrong user'));
          this.inLoading = false;
        }
      },
      (error) => {
        console.warn(error);
        this.inLoading = false;
        this.spinner.hide();
      },
    );
  }

  errorHandle(error) {
    let msg =
      error.error.errors && error.error.errors.length
        ? error.error.errors.map((item) => item.message)
        : error.error.message
        ? error.error.message
        : 'Error registrando usuario';
    this.toastr.showError(msg, 'Error', 10000);
  }

  falseSuccessHandle(data): boolean {
    const dataString = {
      name: data,
      username: data,
    };
    this.loggedInUserService.setLoggedInUser(dataString);
    this.inLoading = false;
    return true;
  }

  matchValidator(group: FormGroup) {
    const pass = group.controls['password'].value;
    const repeat = group.controls['repeat'].value;
    if (pass === repeat) {
      return null;
    }
    return {
      mismatch: true,
    };
  }

  onShowRegistration() {
    this.showRegistrationForm = true;
    this.showLoginForm = false;
    this.showPinForm = false;
    this.showResetPassForm = false;
    this.showNewPassForm = false;
    this.showActivateForm = false;
  }

  onShowActivate() {
    this.showRegistrationForm = false;
    this.showLoginForm = false;
    this.showPinForm = false;
    this.showResetPassForm = false;
    this.showNewPassForm = false;
    this.showActivateForm = true;
  }

  onChangePass() {
    this.showLoginForm = false;
    this.showRegistrationForm = false;
    this.showPinForm = false;
    this.showResetPassForm = true;
    this.showNewPassForm = false;
    this.showActivateForm = false;
  }

  onSetValidationPin() {
    this.showPinForm = true;
    this.showRegistrationForm = false;
    this.showLoginForm = false;
    this.showResetPassForm = false;
    this.showActivateForm = false;
  }

  onSignUp() {
    const data = this.registrationForm.value;
    data.password = data.passwords.password;
    data.lastName = data.lastname;
    data.role = 'Client';
    let token = localStorage.getItem('token');
    if (token != undefined) {
      data.token = token;
    }
    this.spinner.show();
    this.inLoading = true;
    this.showPinForm = false;
    this.showLoginForm = false;
    this.showResetPassForm = false;
    this.showRegistrationForm = true;

    this.authService.singUp(data).subscribe(
      (result) => {
        this.toastr.showInfo(
          this.translate.instant(
            `You have successfully registered, verify your email to complete the account validation`,
          ),
          '',
          10000,
        );
        this.inLoading = false;
        this.showPinForm = true;
        this.showRegistrationForm = false;
        this.showLoginForm = false;
        this.showResetPassForm = false;
        this.spinner.hide();
        return true;
      },
      (error) => {
        this.spinner.hide();
        this.utilsService.errorHandle(error);
        this.inLoading = false;
      },
    );

    return false;
  }

  onValidateAccount() {
    const data = this.activateForm.value;
    return this.validatePing(data);
  }

  onCheckPin(email?) {
    const data = this.pinForm.value;
    if (email) {
      data.email = email;
    } else {
      data.email = this.registrationForm.value.email;
    }
    return this.validatePing(data);
  }

  private validatePing(data) {
    this.inLoading = true;
    this.spinner.show();
    this.authService.validatePing(data).subscribe(
      (result) => {
        this.toastr.showSucces('Registrado correctamente', '', 6000);
        this.showRegistrationForm = false;
        this.showPinForm = false;
        this.showResetPassForm = false;
        this.showActivateForm = false;
        this.showLoginForm = true;
        this.spinner.hide();
        this.loggedInUserService.saveAccountCookie(result.data.Authorization);
        this.loggedInUserService.updateUserProfile(result.data.profile);
        this.toastr.showInfo(
          this.translate.instant('You have successfully logged into our system'),
          this.translate.instant('User login'),
          10000,
        );
        this.inLoading = false;
        this.router.navigate([this.routeToNavigate]);
        return true;
      },
      (error) => {
        this.utilsService.errorHandle(error);
        this.inLoading = false;
        this.spinner.hide();
      },
    );

    return false;
  }

  onGoBefore() {
    if (this.showRegistrationForm) {
      this.showLoginForm = true;
      this.showRegistrationForm = false;
      this.showPinForm = false;
      this.showNewPassForm = false;
      this.showResetPassForm = false;
      this.showActivateForm = false;
    } else if (this.showPinForm) {
      this.showLoginForm = false;
      this.showRegistrationForm = true;
      this.showPinForm = false;
      this.showResetPassForm = false;
      this.showNewPassForm = false;
      this.showActivateForm = false;
    } else if (this.showResetPassForm) {
      this.showLoginForm = true;
      this.showRegistrationForm = false;
      this.showPinForm = false;
      this.showResetPassForm = false;
      this.showNewPassForm = false;
      this.showActivateForm = false;
    } else if (this.showNewPassForm) {
      this.showLoginForm = true;
      this.showRegistrationForm = false;
      this.showPinForm = false;
      this.showResetPassForm = false;
      this.showNewPassForm = false;
      this.showActivateForm = false;
    } else if (this.showActivateForm) {
      this.showLoginForm = true;
      this.showRegistrationForm = false;
      this.showPinForm = false;
      this.showResetPassForm = false;
      this.showNewPassForm = false;
      this.showActivateForm = false;
    }
  }

  onSendEmail2ChangePass() {
    this.inLoading = true;
    this.spinner.show();
    this.authService.passForgot(this.insertEmailPassForm.value).subscribe(
      () => {
        this.showRegistrationForm = false;
        this.showPinForm = false;
        this.showResetPassForm = false;
        this.showLoginForm = false;
        this.showNewPassForm = true;
        this.inLoading = false;
        this.spinner.hide();
        this.toastr.showInfo(
          'Solicitud procesada con éxito, verifique el pin enviado al correo',
          'Solicitud procesada',
          5000,
        );
      },
      (error) => {
        this.utilsService.errorHandle(error, 'Pin', 'Verify');
        this.spinner.hide();
        this.inLoading = false;
      },
    );
  }

  onNewPass(pin, password) {
    this.inLoading = true;
    this.spinner.show();
    this.authService
      .changePass({
        pin: pin,
        password: password,
        email: this.insertEmailPassForm.value.email,
      })
      .subscribe(
        () => {
          this.toastr.showSucces('Cambio de contraseña correctamente', 'OK', 8000);
          this.onGoBefore();
          this.inLoading = false;
          this.spinner.hide();
        },
        (error) => {
          this.utilsService.errorHandle(error);
          this.inLoading = false;
          this.spinner.hide();
        },
      );
  }

  //////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  handleReset() {}

  handleExpire() {}

  handleSuccess(event) {}

  handleLoad() {}

  onSelectPdf($event) {
    this.pdfData = [];
    $event.forEach((doc) => {
      this.pdfData.push({
        ...doc,
        fkId: null,
        fkModel: 'UserId',
      });
    });
    this.validDocumentSelection();
    //
    // this.pdfData[index]   = {
    //   ...$event,
    //   fkId   : null,
    //   fkModel: 'UserId',
    // };
    // console.log(this.pdfData);
    // this.selectedDocument = true;
  }

  validDocumentSelection() {
    this.selectedDocument = false;
    this.pdfData.forEach((document) => {
      if (document) {
        this.selectedDocument = true;
      }
    });
  }

  savePdf(result) {
    if (this.pdfData) {
      this.pdfData.forEach((document) => {
        if (document) {
          let doc = { ...document };
          doc.fkId = result.data.id;
          // this.uploadFilesService.emitUploadStart(doc);
        }
      });
    }
  }

  onAddDocument() {
    this.pdfData.push(null);
    this.validDocumentSelection();
  }

  onRemoveDocument(index) {
    this.pdfData.splice(index, 1);
    this.validDocumentSelection();
  }

  /////////////////////////////////////////////////////////
}
