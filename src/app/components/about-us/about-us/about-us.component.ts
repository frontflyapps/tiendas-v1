import { environment } from 'src/environments/environment';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactUsService } from '../../../core/services/contact-us/contact-us.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, OnDestroy {
  contactUsForm: FormGroup;
  loggedInUser = null;
  _unsubscribeAll: Subject<any>;
  aboutUs: any;
  language = 'es';
  imageUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private translate: TranslateService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });
    this.language = this.translate.getDefaultLang();
    this.contactUsService.getAboutUs().subscribe((data) => {
      this.aboutUs = data;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
