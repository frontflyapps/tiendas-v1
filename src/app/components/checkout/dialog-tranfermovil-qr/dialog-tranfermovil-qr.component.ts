import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-tranfermovil-qr',
  templateUrl: './dialog-tranfermovil-qr.component.html',
  styleUrls: ['./dialog-tranfermovil-qr.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogTranfermovilQrComponent implements OnInit, OnDestroy {
  loggedInUser: any;
  launchTM: any;
  public imgQR = '../../../../assets/images/noImage.jpg';
  public imgQRRequest = true;
  public finalPrice: number;
  public currency: string;
  _unsubscribeAll: Subject<any>;

  constructor(
    public dialogRef: MatDialogRef<DialogTranfermovilQrComponent>,
    private loggedInUserService: LoggedInUserService,
    private socketIoService: SocketIoService,
    public domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this._listenToSocketIO();
      }
    });

    this.finalPrice = data.finalPrice;
    this.currency = data.currency;
    if (data.paymentData && data.paymentData.qr) {
      this.imgQR = data.paymentData.qr;
    } else {
      this.imgQRRequest = false;
    }

    if (data) {
      this.launchTM =
        'transfermovil://tm_compra_en_linea/action?id_transaccion=' +
        data.paymentData.qrJson.id_transaccion +
        '&importe=' +
        data.paymentData.qrJson.importe +
        '&moneda=' +
        data.paymentData.qrJson.moneda +
        '&numero_proveedor=' +
        data.paymentData.qrJson.numero_proveedor +
        ' ';
    }
  }

  ngOnInit() {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    if (this.loggedInUser) {
      this._listenToSocketIO();
    }
  }

  onCancelarTranfermovilPayment() {
    // this.router.navigate(['/my-orders'], { queryParams: { r: 't' } }).then();
    window.location.assign(`${environment.url}/my-orders`);

    // const dialogRef = this.dialog.open(ConfirmationDialogFrontComponent, {
    //   width: '550px',
    //   data: {
    //     title: 'Cancelar la confirmación con transfermovil',
    //     textHtml: `
    //     <h4 style="text-transform:none !important; line-height:1.6rem !important;">
    //       ¿ Desea cancelar la confirmación con transfermóvil ?
    //     </h4>
    //    `,
    //   },
    // });

    // dialogRef.afterClosed().subscribe(async (result) => {
    //   if (result) {
    //     window.location.reload();
    //   }
    // });
  }

  close() {
    this.dialogRef.close();
  }

  _listenToSocketIO() {
    this.socketIoService
      .listen('payment-confirmed')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.dialogRef.close();
      });

    this.socketIoService
      .listen('payment-error')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.dialogRef.close();
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
