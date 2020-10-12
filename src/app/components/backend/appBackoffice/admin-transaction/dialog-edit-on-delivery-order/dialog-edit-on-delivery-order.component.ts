import { environment } from './../../../../../../environments/environment';

import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from '../../../services/user/user.service';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { AdminTransactionService } from '../services/admin-orders/admin-transaction.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-edit-on-delivery-order',
  templateUrl: './dialog-edit-on-delivery-order.component.html',
  styleUrls: ['./dialog-edit-on-delivery-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogEditOnDeliveryOrderComponent implements OnInit, OnDestroy {
  isSaving = false;
  loggedInUser: any;
  selectedDelivery: any;
  imageUrl: any;
  _unsubscribeAll: Subject<any>;
  allMessengers: any[] = [];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEditOnDeliveryOrderComponent>,
    private loggedInUserService: LoggedInUserService,
    private userService: UserService,
    public currencyService: CurrencyService,
    public utilsService: UtilsService,
    public spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private transactionService: AdminTransactionService,
    private showToastr: ShowToastrService,
    private translate: TranslateService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();
    this.selectedDelivery = data.selectedDelivery;
    this.buildFormPayment();
    this.imageUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.userService.getAllMEssengers({ limit: 0, offset: 0 }).subscribe((data) => {
      this.allMessengers = data.data;
    });
  }

  buildFormPayment() {
    this.form = this.fb.group({
      DeliveryId: [this.selectedDelivery.id, [Validators.required]],
      deliveryCost: [this.selectedDelivery.deliveryCost, [Validators.required, Validators.min(0)]],
      description: [this.selectedDelivery.description, []],
      MessengerId: [this.selectedDelivery.MessengerId],
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ////////////////////////////////
  onSave(): void {
    this.spinner.show();
    const data: any = {
      id: this.selectedDelivery.id,
      ...this.form.value,
    };
    console.log('onSave -> data', data);
    this.transactionService.updateDelivery(data).subscribe(
      (response) => {
        console.log('onSave -> response', response);
        this.spinner.hide();
        this.showToastr.showSucces(this.translate.instant('Entrega editada con éxito'), 'Success');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinner.hide();
      },
    );
  }
}
