import { ShowToastrService } from './core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from './core/services/loggedInUser/logged-in-user.service';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from './core/services/navigation/navigation.service';
import { Router, NavigationEnd, NavigationError, NavigationCancel, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CssOptions } from 'guachos-cu-down-list';
import { Subject } from 'rxjs';
import { UploadFilesService } from './core/services/upload-service/upload-file.service';
import { CookieService } from 'ngx-cookie-service';
import { EncryptDecryptService } from './core/services/encrypt-decrypt.service';
import { AuthenticationService } from './core/services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecommerce-sophia-new';
  tokenReferal = undefined;
  uploadFileStartSubject: Subject<any>;
  uploadFileEndSubject: Subject<any>;
  //////////////////////////////////////////////////////////
  apiUrlRepositoy: any = environment.apiUrlRepositoy;
  cssOptions: CssOptions = {
    color: 'primary',
    width: '40%',
  };

  localDatabaseUsers = environment.localDatabaseUsers;

  constructor(
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private router: Router,
    private showToastr: ShowToastrService,
    private uploadFilesService: UploadFilesService,
    private cookieService: CookieService,
    private loggedInUserService: LoggedInUserService,
    private authService: AuthenticationService,
    private encryptDecryptService: EncryptDecryptService,
  ) {
    const defaultLanguage: any = { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' };
    if ('language' in localStorage) {
      let language = JSON.parse(localStorage.getItem('language'));
      language = language ? language : defaultLanguage;
      this.translate.setDefaultLang(language.lang);
      this.translate.use(language.lang);
    } else {
      this.translate.setDefaultLang(defaultLanguage.lang);
      localStorage.setItem('language', JSON.stringify(defaultLanguage));
    }
    this.initSystem();
  }

  ngOnInit() {
    /** spinner starts on init */
    // try {
    //   console.log(
    //     '/*/*/*/*/*/*/*',
    //     this.encryptDecryptService.decrypt('U2FsdGVkX1/D/8ch+37Gv1Me0kE3SIYNUxAtoG6hmz3TnHoGfrMOyhROXmnJ+txb'),
    //   );
    // } catch (e) {
    //   console.log('AppComponent -> ngOnInit -> e', e);
    // }

    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);

    ////////////////////LOGICA PARA ESCUCHAR LOS EVENTOS DE SUBIDA //////////////////////////
    console.log('Entre aqui en el init de app');
    this.uploadFileStartSubject = this.uploadFilesService.$uploadFileStart;
    this.uploadFileEndSubject = this.uploadFilesService.$uploadFileEnd;
    /////////////////////////////////////////////////////////////////////////////////////////////
  }
  ////////////////////////////
  public onFinishFile(event) {
    console.log('********TERMINADO DE SUBIR EL ARCHIVO************************', event);
    this.uploadFilesService.emitUploadEnd(event);
    this.showToastr.showInfo(`El archivo se ha subido al sistema exitósamente`);
  }
  public onProgress(event) {
    // console.log('**************PROGRESO**************************', event);
    this.uploadFilesService.emitUploadProgress(event);
  }
  public onCancelFile(event) {
    console.log('********CANCELADO EL ARCHIVO************************', event);
    this.showToastr.showInfo(`La subida del  archivo ha sido cancelada`);
  }
  ////////////////////////////

  initSystem() {
    if (!this.localDatabaseUsers) {
      const isCookieaAccount = this.cookieService.check('account');
      console.log('AppComponent -> initSystem -> token', isCookieaAccount);
      const userLogged = this.loggedInUserService.getLoggedInUser();
      if (isCookieaAccount && !userLogged) {
        console.log('***** TOMANDO LA COOKIE DEL DOMINIO Y OBTENIENDO USER *********');
        const token = this.encryptDecryptService.decrypt(this.cookieService.get('account'));
        console.log('AppComponent -> initSystem -> token', token);
        this.authService.getProfile(token).subscribe((user) => {
          console.log('AppComponent -> initSystem -> user', user);
          const userData = { profile: user.data, Authorization: token };
          this.loggedInUserService.updateUserProfile(userData);
          this.cookieService.delete('account', '/', '.cubaeduca.com');
        });
      }
    }
  }
}
