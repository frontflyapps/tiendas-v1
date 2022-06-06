import { PayService } from './../../../core/services/pay/pay.service';
import { TranslateService } from '@ngx-translate/core';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-processing-payment-error',
  templateUrl: './processing-payment-error.component.html',
  styleUrls: ['./processing-payment-error.component.scss'],
})
export class ProcessingPaymentErrorComponent implements OnInit {
  showError = false;
  showCancelled = false;
  loadingSearch = true;
  queryParams = null;
  transaction_uuid = null;
  selectedDataPay = null;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private showToastr: ShowToastrService,
    private payService: PayService,
  ) {
  }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.transaction_uuid =
      this.queryParams && this.queryParams.transaction_uuid ? this.queryParams.transaction_uuid : undefined;
    if (!this.transaction_uuid) {
      this.showToastr.showError(this.translate.instant('Usted debe pasar una transaccíon válida'), '!Error');
      this.showError = true;
      this.loadingSearch = false;
      return;
    } else {
      this.payService.setCompleteTranferPayment({ transaction_uuid: this.transaction_uuid, status: 'KO' }).subscribe(
        (data) => {
          this.showCancelled = true;
          this.loadingSearch = false;
          this.showToastr.showInfo(
            'Su pago se ha cancelado exitósamente en la pasarela de enzona. La transacción no ha sido ejecutada en el sistema.',
            '',
            8000,
          );
        },
        (error) => {
          this.showCancelled = false;
          this.showError = true;
          this.loadingSearch = false;
        },
      );
    }
  }
}
