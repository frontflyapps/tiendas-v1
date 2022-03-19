import { TranslateService } from '@ngx-translate/core';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { CartService } from './../../shared/services/cart.service';
import { PayService } from './../../../core/services/pay/pay.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-enzona-payment-ok',
  templateUrl: './enzona-payment-ok.component.html',
  styleUrls: ['./enzona-payment-ok.component.scss'],
})
export class EnzonaPaymentOkComponent implements OnInit {
  selectedDataPay: any = null;
  queryParams: any = null;
  paymentId: any = null;
  transaction_uuid: any = null;
  PayerID: any = null;
  loadingSearch = false;
  form: FormGroup;
  ifSuccess = false;
  showError = false;
  payMentResult: any = null;
  amount = 0;
  language: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private showToastr: ShowToastrService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private payService: PayService,
    private cartService: CartService,
  ) {
    this.loadingSearch = true;
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
      this.payService.setCompleteTranferPayment({ transaction_uuid: this.transaction_uuid, status: 'OK' }).subscribe(
        (data) => {
          this.payMentResult = data.data;
          this.ifSuccess = true;
          this.loadingSearch = false;
          this.showError = false;
          this.clearShoopingCart();
          this.showToastr.showInfo(
            'Su pago se ha realizado exitósamente en la pasarela de enzona, le hemos enviado un email con el voucher de confirmacion de su reserva. Gracias por usar nuetra plataforma !!',
            '',
            8000,
          );
        },
        (error) => {
          this.ifSuccess = false;
          this.showError = true;
          this.loadingSearch = false;
        },
      );
    }
  }

  async clearShoopingCart() {
    localStorage.setItem('cartItem', JSON.stringify([]));
    this.cartService.$cartItemsUpdated.next([]);
  }
}
