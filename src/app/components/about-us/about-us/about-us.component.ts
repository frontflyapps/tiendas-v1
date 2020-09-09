import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from './../../../core/services/show-snackbar/show-snackbar.service';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactUsService } from '../../backend/services/contact-us/contact-us.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit, OnDestroy {
  contactUsForm: FormGroup;
  loggedInUser = null;
  _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private translate: TranslateService,
    private showSnackbar: ShowSnackbarService,
    private utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    if (this.loggedInUser) {
      this.contactUsForm = this.fb.group({
        name: [this.loggedInUser.name + ' ' + this.loggedInUser.lastName, [Validators.required]],
        email: [this.loggedInUser.email, [Validators.required, Validators.email]],
        message: [null, [Validators.required]],
      });
    } else {
      this.contactUsForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [null, [Validators.required]],
        message: [null, [Validators.required]],
      });
    }
  }

  ngOnInit() {
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });
  }

  onSendMessage() {
    let value = this.contactUsForm.value;

    this.contactUsService.createContactUs(value).subscribe(() => {
      this.showSnackbar.showSucces(
        this.translate.instant(
          'Your message has been sent successfully, we analyze it as soon as possible and we respond to your email',
        ),
        8000,
      );
      this.contactUsForm.reset();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
