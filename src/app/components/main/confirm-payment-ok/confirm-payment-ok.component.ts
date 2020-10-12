import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../environments/environment';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { IUser } from '../../../core/classes/user.class';
import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-payment-ok',
  templateUrl: './confirm-payment-ok.component.html',
  styleUrls: ['./confirm-payment-ok.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmPaymentOkComponent implements OnInit {
  innerWidth: any;
  applyStyle = false;
  urlImage: any = '';
  loggedInUser: IUser;
  selectedPayment: any = undefined;

  status: any = {
    confirmed: {
      status: {
        es: 'pagado',
        en: 'confirmed',
      },
      primary: '#4caf50',
      weight: 400,
      class: 'payedLabel',
    },
    requested: {
      status: {
        es: 'solicitado',
        en: 'requested',
      },
      primary: '#ffc107',
      weight: 400,
      class: 'requestedLabel',
    },
    cancelled: {
      status: {
        es: 'cancelado',
        en: 'cancelled',
      },
      primary: '#f44336',
      weight: 400,
      class: 'cancelledLabel',
    },
    'processing-cancel': {
      status: {
        es: 'canc. en progreso',
        en: 'processing cancel',
      },
      primary: '#795548',
      weight: 400,
      class: 'processingCancelLabel',
    },
    delivered: {
      status: {
        es: 'entregado',
        en: 'delivered',
      },
      weight: 600,
      primary: '#2196f3',
      class: 'deliveredLabel',
    },
    onDelivery: {
      status: {
        es: 'en camino',
        en: 'on Delivery',
      },
      weight: 600,
      primary: '#ff5722',
      class: 'onDeliveryLabel',
    },
  };

  action = 'confirmed';

  language = 'es';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmPaymentOkComponent>,
    private loggedInUserService: LoggedInUserService,
    public utilsService: UtilsService,
    private showToastr: ShowToastrService,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.urlImage = utilsService.getUrlImages();
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.selectedPayment = data.selectedPayment;
    console.log('ConfirmPaymentOkComponent ->  this.selectedPayment', this.selectedPayment);
    this.action = data.action;
    console.log('ConfirmPaymentOkComponent ->  this.action', this.action);
    this.language = this.loggedInUserService.getLanguage().lang;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
    if (this.action == 'confirmed') {
      this.showToastr.showInfo(
        this.translateService.instant('Pago confirmado correctamente'),
        this.translateService.instant('Confirmación exitósa'),
        8000,
      );
    } else {
      this.showToastr.showInfo(
        this.translateService.instant('Pago cancelado correctamente'),
        this.translateService.instant('Confirmación exitósa'),
        8000,
      );
    }
  }

  ngOnDestroy(): void {}

  onGetVoucher(payment): void {}

  onAccept(payment): void {
    this.router.navigate(['/my-orders'], { queryParams: { orderId: payment.id } });
    this.dialogRef.close(true);
  }
}
