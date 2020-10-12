import { AdminTransactionService } from './../services/admin-orders/admin-transaction.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { PayService } from 'src/app/core/services/pay/pay.service';

@Component({
  selector: 'app-admin-cancel-order',
  templateUrl: './admin-cancel-order.component.html',
  styleUrls: ['./admin-cancel-order.component.scss'],
})
export class AdminCancelOrderComponent implements OnInit {
  order: any;
  cancellationText =
    'Usted desea cancelar un pago en nuestra plataforma, la devolucion será de acorde a nuestros términos y condiciones';
  loadData = false;
  cancelNote = 'Cancelación desde la administración';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private transactionService: AdminTransactionService,
    public utilsFront: UtilsService,
    public dialogRef: MatDialogRef<AdminCancelOrderComponent>,
  ) {
    this.order = data.order;
    // console.log('CancelOrderComponent -> this.order', this.order);
  }

  ngOnInit() {}

  onCancelar() {
    // console.log('CancelOrderComponent -> onCancelar -> this.order.payemntType', this.order.payemntType);
    this.spinner.show();
    const body = { id: this.order.id, cancelNote: this.cancelNote };
    this.transactionService.cancellOrder(body).subscribe(
      (val) => {
        this.loadData = false;
        this.spinner.hide();
        if (this.order.paymentType == 'transfermovil') {
          this.showToastr.showSucces(
            `La  reserva esta en proceso de cancelación en Transfermovil. Le notificaremos la respuesta.`,
            'Ok',
            8000,
          );
        }
        if (this.order.paymentType == 'enzona') {
          this.showToastr.showSucces(
            `Su reserva se ha cancelado correctamente y la devolución fue realizada a través de Enzona`,
            'Ok',
            8000,
          );
        }
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
  }
}
