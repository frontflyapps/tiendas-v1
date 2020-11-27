
import { Component, OnInit } from '@angular/core';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CopyTermsService } from 'src/app/core/services/copy-terms/copy-terms.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  language = null;
  _unsubscribeAll: Subject<any> = new Subject();
  text: undefined;
  constructor(private loggedInUserService: LoggedInUserService, private privService: CopyTermsService) {
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
    this.privService.getCopyRight().subscribe((data: any) => {
      this.text = data?.data[0].text;
    })
  }

  // ngOnDestroy() {
  //   this._unsubscribeAll.next(true);
  //   this._unsubscribeAll.complete();
  // }

}
