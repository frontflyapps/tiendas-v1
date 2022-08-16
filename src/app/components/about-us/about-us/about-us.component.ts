import { MetaService } from './../../../core/services/meta.service';
import { environment } from 'src/environments/environment';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactUsService } from '../../../core/services/contact-us/contact-us.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, OnDestroy {
  contactUsForm: UntypedFormGroup;
  loggedInUser = null;
  _unsubscribeAll: Subject<any>;
  aboutUs: any;
  language = 'es';
  imageUrl = environment.apiUrl;

  constructor(
    private fb: UntypedFormBuilder,
    private contactUsService: ContactUsService,
    private translate: TranslateService,
    private loggedInUserService: LoggedInUserService,
    private metaService: MetaService,
  ) {
    this._unsubscribeAll = new Subject();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.metaService.setMeta(
      'Quienes somos?',
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });
    this.language = this.translate.getDefaultLang();
    this.contactUsService.getAboutUs().subscribe((data) => {
      this.aboutUs = data;
      if (this.aboutUs.image) {
        this.metaService.setMeta(null, null, this.imageUrl + this.aboutUs.image, null);
      }
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
