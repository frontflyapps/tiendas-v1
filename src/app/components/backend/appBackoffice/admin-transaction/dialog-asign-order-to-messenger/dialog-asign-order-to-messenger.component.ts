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
  selector: 'app-dialog-asign-order-to-messenger',
  templateUrl: './dialog-asign-order-to-messenger.component.html',
  styleUrls: ['./dialog-asign-order-to-messenger.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAsignOrderToMessengerComponent implements OnInit, OnDestroy {
  isSaving = false;
  loggedInUser: any;
  selectedOrders: any;
  imageUrl: any;
  _unsubscribeAll: Subject<any>;
  messengerSelected = new SelectionModel(true, []);
  formClientSearch: FormControl;
  filteredMessenger: any[] = [];
  allMessengers: any[] = [];
  formPaymentDataArray: FormArray = new FormArray([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAsignOrderToMessengerComponent>,
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
    this.selectedOrders = data.selectedOrders;
    this.buildFormPayment();
    this.imageUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.formClientSearch = new FormControl();
    this.formClientSearch.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((value) => {
      this.filteredMessenger = this.allMessengers.filter(function (item) {
        const searchElement = value.toLowerCase().trim();
        const sourceElement = item.name.toLowerCase().trim();
        const reg = new RegExp(searchElement);
        return reg.test(sourceElement);
      });
    });
    this.fetchData();
  }

  fetchData() {
    this.userService.getAllMEssengers({ limit: 0, offset: 0 }).subscribe((data) => {
      data.data = [
        ...data.data.map((item) => {
          item.name = item.Person.name;
          item.lastName = item.Person.lastName;
          item.email = item.Person.email;
          item.username = item.Person.username;
          item.status = item.Person.status;
          return item;
        }),
      ];
      this.allMessengers = data.data;
      this.filteredMessenger = [...this.allMessengers];
    });
  }

  buildFormPayment() {
    for (let payment of this.selectedOrders) {
      this.formPaymentDataArray.push(
        this.fb.group({
          PaymentId: [payment.id, [Validators.required]],
          deliveryCost: [payment.shippingCost, [Validators.required, Validators.min(0)]],
          description: ['Generando entrega', []],
          Payment: [payment],
        }),
      );
    }
  }

  getAllItemToBeDelivered(order) {
    // console.log('getAllItemToBeDelivered -> order', order);
    let c = 0;
    for (const paymentItemX of order.PaymentItems) {
      c += paymentItemX.Product.type == 'physical' ? 1 : 0;
    }
    return c;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onMessengerChange(messenger) {
    console.log('onMessengerChange -> messenger', messenger);
    if (this.messengerSelected.isSelected(messenger)) {
      this.messengerSelected.deselect(messenger);
    } else {
      this.messengerSelected.clear();
      this.messengerSelected.select(messenger);
    }
  }

  ////////////////////////////////
  onSave(): void {
    this.spinner.show();
    const data: any = {
      MessengerId: this.messengerSelected.selected[0].id,
      paymentDataInfo: this.formPaymentDataArray.value,
    };
    console.log('onSave -> data', data);
    this.transactionService.setDeliveryConfirmedOrders(data).subscribe(
      () => {
        this.spinner.hide();
        this.showToastr.showSucces(this.translate.instant('Entrega generada con éxito'), 'Success');
        this.showToastr.showInfo(
          'Se le enviaran por correo a el mensajero los detalles de la orden para que realize la entrega lo mas rápido posible',
          'Info',
          8000,
        );
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinner.hide();
      },
    );
  }
}
