import { UtilsService } from './../../../core/services/utils/utils.service';
import { environment } from './../../../../environments/environment';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { PayService } from 'src/app/core/services/pay/pay.service';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss'],
})
export class CancelOrderComponent implements OnInit {
  order: any;
  cancellationText =
    'Usted desea cancelar un pago en nuestra plataforma, la devolucion será de acorde a nuestros términos y condiciones';
  cancellationType = 'REQUESTED_BY_CLIENT';
  cancellationTypes = [
    { id: 'REQUESTED_BY_CLIENT', name: 'Petición del cliente' },
    { id: 'MAJOR_FORCE', name: 'Fuerza mayor' },
    { id: 'CONDITION_BREACH', name: 'Incidente de viaje' },
  ];
  loadData = false;
  cancelNote = 'Solicitud el cliente';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private payService: PayService,
    public utilsFront: UtilsService,
    public dialogRef: MatDialogRef<CancelOrderComponent>,
  ) {
    this.order = data.order;
    if (this.order.status == 'on-delivery') {
      this.cancellationText = `Este pago está en proceso de envío, por lo que para continuar con su cancelación,
         y correspondiente devolución póngase en contacto con los administradores de la plataforma,
        llame al número de la página o contacte el correo`;
    }
  }

  ngOnInit() {}

  onCancelar() {
    // console.log('CancelOrderComponent -> onCancelar -> this.order.payemntType', this.order.payemntType);
    this.spinner.show();
    let body = { id: this.order.id, cancelNote: this.cancelNote };
    if (this.order.paymentType == 'transfermovil') {
      this.payService.cancelPaymentTranfermovil(body).subscribe(
        (val) => {
          this.loadData = false;
          this.spinner.hide();
          this.showToastr.showSucces(
            `Su reserva esta en proceso de cancelacion en Transfermovil. Le notificaremos la respuesta.`,
            'Ok',
            8000,
          );
          this.dialogRef.close(true);
        },
        (error: any) => {
          this.loadData = false;
          this.spinner.hide();
          if (error.status == 403 || error.status == 401) {
            this.dialogRef.close(true);
          }
        },
      );
    } else if (this.order.paymentType == 'enzona') {
      console.log('Entre aqui');
      this.payService.cancelPaymentEnzona(body).subscribe(
        (val) => {
          this.loadData = false;
          this.spinner.hide();
          this.showToastr.showSucces(
            `Su reserva se ha cancelado correctamente y la devolución fue realizada a través de Enzona`,
            'Ok',
            8000,
          );
          this.dialogRef.close(true);
        },
        (error: any) => {
          this.loadData = false;
          this.spinner.hide();
          if (error.status == 403 || error.status == 401) {
            this.dialogRef.close(true);
          }
        },
      );
    } else {
      this.loadData = false;
      this.spinner.hide();
      this.showToastr.showInfo('No podemos cancelar un pedido en una TPV inválida, contacte a sus administradores');
      this.dialogRef.close(true);
      return;
    }
  }
}
