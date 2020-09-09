import { environment } from './../../../../../../environments/environment';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TransactionListComponent implements OnInit {
  @Input() set _transactions(value) {
    this.allTransaction = [...value];
  }
  @Input() set _payment(value) {
    this.payment = value;
  }

  language = 'es';
  displayedColumns = ['image', 'product', 'type', 'qty', 'total'];

  allTransaction: any[] = [];
  payment = undefined;
  _unsubscribeAll: Subject<any> = new Subject<any>();
  imageUrl = environment.apiUrl;

  constructor(private loggedInUserService: LoggedInUserService) {
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
