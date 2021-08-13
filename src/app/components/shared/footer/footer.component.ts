import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  language: string;
  currency: string;

  flag: any;
  flags = [
    { name: 'Español', image: 'assets/images/flags/es.svg', lang: 'es' },
    { name: 'English', image: 'assets/images/flags/en.svg', lang: 'en' },
  ];

  year: number;
  languages: any[] = [
    {
      value: 'es',
      language: 'Español',
    },
    {
      value: 'en',
      language: 'Ingles',
    },
  ];

  constructor(
    // private loggedInUserService: LoggedInUserService,
    public translate: TranslateService,
  ) {
    let tempFlag = JSON.parse(localStorage.getItem('language'));
    this.flag = tempFlag ? tempFlag : this.flags[0];
  }

  ngOnInit(): void {
    this.language = this.translate.currentLang;
    // this.currency = environment.defaultCurrency;
    this.year = new Date().getFullYear();
  }

  public changeLang(flag) {
    this.translate.use(flag.lang);
    localStorage.setItem('language', JSON.stringify(flag));
    this.flag = flag;
    // this.loggedInUserService.$languageChanged.next(flag);
  }

  onSwitchLanguage(): void {
    this.translate.use(this.language);
    localStorage.setItem('language', this.language);
    // this.loggedInUserService.languageChange(this.language);
  }
}
