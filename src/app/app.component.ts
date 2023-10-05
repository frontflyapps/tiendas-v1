import { ShowToastrService } from './core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from './core/services/loggedInUser/logged-in-user.service';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CssOptions } from 'guachos-cu-down-list';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { EncryptDecryptService } from './core/services/encrypt-decrypt.service';
import { AuthenticationService } from './core/services/authentication/authentication.service';
import { LocalStorageService } from './core/services/localStorage/localStorage.service';
import { RequestCookieSecureService } from './core/services/request-cookie-secure/request-cookie-secure.service';
import { SplashScreenService } from './core/services/splash-screen/splash-screen.service';
import { Meta } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogNoCartSelectedComponent } from './components/checkout/no-cart-selected/no-cart-selected.component';
import { DialogPhoneComponent } from './components/shared/dialog-phone/dialog-phone.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecommerce-sophia-new';
  uploadFileStartSubject: Subject<any>;
  cssOptions: CssOptions = {
    color: 'primary',
    width: '40%',
  };

  private businessConfig = this.localStorageService.getFromStorage('business-config');

  localDatabaseUsers = environment.localDatabaseUsers;

  constructor(
    private rq: RequestCookieSecureService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    private showToastr: ShowToastrService,
    private cookieService: CookieService,
    private loggedInUserService: LoggedInUserService,
    private authService: AuthenticationService,
    private encryptDecryptService: EncryptDecryptService,
    private localStorageService: LocalStorageService,
    private meta: Meta,
    private splashService: SplashScreenService,
  ) {
    this.metaAdd();
    this.rq.requestCookiesSecure();

    this.localStorageService.setVersion();
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

  public onFinishFile(event) {
    this.showToastr.showInfo(`El archivo se ha subido al sistema exitósamente`);
  }

  public onProgress(event) {
    // this.uploadFilesService.emitUploadProgress(event);
  }

  public metaAdd() {
    this.meta.updateTag({ name: 'title', content: 'Tienda Guajiritos' });
    this.meta.updateTag({ name: 'keywords', content: 'HTML, CSS, JavaScript, Angular, Tienda Online B2B, comercio online' });
    this.meta.updateTag({ property: 'og:url', content: 'https://guajiritos.com/' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Tienda Guajiritos' });
    this.meta.updateTag({
      property: 'og:image',
      itemprop: 'image primaryImageOfPage',
      content: 'https://tienda.guajiritos.com/assets/images/share-img.png',
    });
    this.meta.updateTag({ property: 'twitter:domain', content: 'https://guajiritos.com/' });
    this.meta.updateTag({ property: 'twitter:title', content: 'Tienda Guajiritos' });
    this.meta.updateTag({ property: 'twitter:description', content: 'Tienda online B2C.' });
    this.meta.updateTag({ property: 'twitter:image', content: 'https://tienda.guajiritos.com/assets/images/share-img.png' });
  }

  public onCancelFile(event) {
    this.showToastr.showInfo(`La subida del  archivo ha sido cancelada`);
  }

  // //////////////////////////

  initSystem() {
    const isCookieAccount = this.cookieService.check('account');
    const userLogged = this.loggedInUserService.getLoggedInUser();
    console.log(userLogged);

    if (this.businessConfig?.phoneRequired === true) {
      if (userLogged && (userLogged.phone === '' || !userLogged.PhoneCallingCodeId)) {
        let dialogRef: MatDialogRef<DialogPhoneComponent, any>;
        dialogRef = this.dialog.open(DialogPhoneComponent, {
          width: '15cm',
          maxWidth: '100vw',
          disableClose: true,
          data: {
            phone: userLogged.phone,
            PhoneCallingCodeId: userLogged.PhoneCallingCodeId
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
      }
    }

    if (isCookieAccount) {
      try {
        const token = this.encryptDecryptService.decrypt(this.cookieService.get('account'));
        this.authService.getProfile(token).subscribe({
          next: (user) => {
            this.loggedInUserService.updateUserProfile(user.data);
            console.log(this.loggedInUserService.getLoggedInUser());
          },
          error: (error) => {
            this.loggedInUserService.setLoggedInUser(null);
            this.loggedInUserService.removeCookies();
            this.loggedInUserService.$loggedInUserUpdated.next(null);
          },
        });
      } catch (e) {
        console.warn('Error decrypt value', e);
        this.localStorageService.actionsToClearSystem();
      }
    } else {
      this.loggedInUserService.setLoggedInUser(null);
      this.loggedInUserService.$loggedInUserUpdated.next(null);
    }
  }
}
