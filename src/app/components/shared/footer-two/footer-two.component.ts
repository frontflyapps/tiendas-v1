import { CurrencyService } from '../../../core/services/currency/currency.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { Subject } from 'rxjs';
import { ShowSnackbarService } from '../../../core/services/show-snackbar/show-snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer-two',
  templateUrl: './footer-two.component.html',
  styleUrls: ['./footer-two.component.scss'],
})
export class FooterTwoComponent implements OnInit, OnDestroy {
  loggedInUser: any = null;
  _unsubscribeAll: Subject<any> = new Subject();
  form: UntypedFormGroup;
  subscribeState = false;
  version = environment.versions.app;
  urlAboutUs = environment.urlAboutUs;
  flag: any;
  flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];
  currencies: any[];
  currency: any;
  translateService: any;
  address: any;
  year = new Date().getFullYear();

  constructor(
    private loggedInUserService: LoggedInUserService,
    private showSnackbar: ShowSnackbarService,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private translate: TranslateService,
    private currencyService: CurrencyService,
  ) {
    //isSubscribed//
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    // const tempStorage = JSON.parse(localStorage.getItem('subscribeState'));
    this.subscribeState = this.loggedInUser ? this.loggedInUser.isSubscribed : false;
    localStorage.setItem('subscribeState', JSON.stringify(this.subscribeState));
    this.address = environment.address;

    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    let tempFlag = JSON.parse(localStorage.getItem('language'));
    this.flag = tempFlag ? tempFlag : this.flags[0];
    this.currencies = this.currencyService.getCurrencies();
    this.currency = this.currencyService.getCurrency();

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      this.subscribeState = this.loggedInUser ? this.loggedInUser.isSubscribed : false;
      localStorage.setItem('subscribeState', JSON.stringify(this.subscribeState));
      ///////////////////////////////////////////////////////
      let tempCurrency = JSON.parse(localStorage.getItem('currency'));
      if (tempCurrency) {
        tempCurrency = this.currencies.find((item) => item.name == tempCurrency.name);
        this.currency = tempCurrency ? tempCurrency : this.currencies[0];
      } else {
        this.currency = this.currencies[0];
      }
      localStorage.setItem('currency', JSON.stringify(this.currency));

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

      ////////////////////////////////////////////////////
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onSubscribetoPublications() {
    let data = this.form.value;
    if (!this.loggedInUser) {
      this.showSnackbar.showSucces(
        this.translateService.instant(
          'You need to be logged in to subscribe it into ours publication, please register or create an account',
        ),
        8000,
      );
      this.router.navigate(['/my-account']);
    } else {
      this.httpClient
        .post<any>(environment.apiUrl + 'subscribe', { email: data.email })
        .subscribe(
          () => {
            this.loggedInUserService.setNewProfile({ isSubscribed: 1 });
            this.showSnackbar.showSucces(
              this.translateService.instant(
                'You have successfully subscribed to our newsletter, your email will receive announcements of new blog posts and new products that go on sale',
              ),
              8000,
            );
          },
          (error) => this.utilsService.errorHandle2(error),
        );
    }
  }

  onUnSubscribePublications() {
    const data = this.form.value;
    this.httpClient
      .patch<any>(environment.apiUrl + 'subscribe', { email: data.email })
      .subscribe(
        () => {
          this.loggedInUserService.setNewProfile({ isSubscribed: 0 });
          this.showSnackbar.showSucces(
            this.translateService.instant('You have successfully unsubscribe to our newsletter'),
            8000,
          );
        },
        (error) => this.utilsService.errorHandle2(error),
      );
  }

  public changeCurrency(currency) {
    this.currency = currency;
    this.currencyService.setCurrency(currency);
  }

  public changeLang(flag) {
    this.translate.use(flag.lang);
    localStorage.setItem('language', JSON.stringify(flag));
    this.flag = flag;
    this.loggedInUserService.$languageChanged.next(flag);
  }
}
