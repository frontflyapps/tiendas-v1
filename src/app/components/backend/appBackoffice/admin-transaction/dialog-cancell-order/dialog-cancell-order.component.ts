import { AdminTransactionService } from './../services/admin-orders/admin-transaction.service';
import { environment } from './../../../../../../environments/environment';

import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormGroupName } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-cancell-order',
  templateUrl: './dialog-cancell-order.component.html',
  styleUrls: ['./dialog-cancell-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogCancellOrderComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedOrder: any;
  imageUrl: any;
  _unsubscribeAll: Subject<any>;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogCancellOrderComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private transactionService: AdminTransactionService,
    private showToastr: ShowToastrService,
    private translate: TranslateService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedOrder = data.selectedOrder;
    this.imageUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      percent: [null, [Validators.required, Validators.min(0)]],
      description: [null, [Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ////////////////////////////////
  onSave(): void {
    this.spinner.show();
    let data = { ...this.form.value };
    data.id = this.selectedOrder.id;
    this.transactionService.cancellOrder(data).subscribe(
      () => {
        this.spinner.hide();
        this.showToastr.showSucces(this.translate.instant(`Orders cancelled successfully`), 'Success');
        this.dialogRef.close(true);
      },
      (error) => {
        this.spinner.hide();
      },
    );
  }
}
