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

  localDatabaseUsers = environment.localDatabaseUsers;

  constructor(
    private rq: RequestCookieSecureService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private router: Router,
    private showToastr: ShowToastrService,
    private cookieService: CookieService,
    private loggedInUserService: LoggedInUserService,
    private authService: AuthenticationService,
    private encryptDecryptService: EncryptDecryptService,
    private localStorageService: LocalStorageService,
    private splashService: SplashScreenService,
  ) {
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

  public onCancelFile(event) {
    this.showToastr.showInfo(`La subida del  archivo ha sido cancelada`);
  }

  // //////////////////////////

  initSystem() {
    const isCookieAccount = this.cookieService.check('account');
    const userLogged = this.loggedInUserService.getLoggedInUser();
    if (isCookieAccount) {
      try {
        const token = this.encryptDecryptService.decrypt(this.cookieService.get('account'));
        this.authService.getProfile(token).subscribe({
          next: (user) => {
            this.loggedInUserService.updateUserProfile(user.data);
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
