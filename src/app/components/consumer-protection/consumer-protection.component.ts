import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CopyTermsService } from '../../core/services/copy-terms/copy-terms.service';

@Component({
  selector: 'app-consumer-protection',
  templateUrl: './consumer-protection.component.html',
  styleUrls: ['./consumer-protection.component.scss'],
})
export class ConsumerProtectionComponent implements OnInit {
  language = null;
  _unsubscribeAll: Subject<any> = new Subject();
  text: undefined;
  constructor(private loggedInUserService: LoggedInUserService, private termService: CopyTermsService) {}

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
    this.termService.getConsumerProtection().subscribe((data: any) => {
      this.text = data?.data[0].text;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
