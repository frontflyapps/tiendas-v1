import { UtilsService } from './../../../core/services/utils/utils.service';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { PayService } from 'src/app/core/services/pay/pay.service';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.scss'],
})
export class CancelOrderComponent implements OnInit {
  order: any;
  form: FormGroup;
  cancellationText =
    'Usted desea cancelar un pago en nuestra plataforma, la devolucion será de acorde a nuestros términos y condiciones';
  cancellationType = 'REQUESTED_BY_CLIENT';
  cancellationTypes = [
    { id: 'REQUESTED_BY_CLIENT', name: 'Petición del cliente' },
    { id: 'MAJOR_FORCE', name: 'Fuerza mayor' },
    { id: 'CONDITION_BREACH', name: 'Incidente de viaje' },
  ];
  loadData = false;
  isCancelRule = false;
  cancellationRule: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['minHour', 'maxHour', 'value'];
  ruleApply: any;
  refund: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private payService: PayService,
    private fb: FormBuilder,
    public utilsFront: UtilsService,
    public dialogRef: MatDialogRef<CancelOrderComponent>,
  ) {
    this.order = data.order;
    this.cancellationRule = this.order?.cancellationRule;
    console.log(this.cancellationRule);
    if (this.order.status == 'on-delivery') {
      this.cancellationText = `Este pago está en proceso de envío, por lo que para continuar con su cancelación,
         y correspondiente devolución póngase en contacto con los administradores de la plataforma,
        llame al número de la página o contacte el correo`;
    }
  }

  ngOnInit() {
    this.isCancelRule = true;
    this.form = this.fb.group({
      rule: [false, [Validators.required]],
      cancelNote: ['Solicitud del cliente', Validators.required],
    });
    this.form.controls['rule'].valueChanges.subscribe((value) => {
      this.isCancelRule = true;
      if (value) {
        this.isCancelRule = false;
      }
    });
    this.dataSource = new MatTableDataSource(this.cancellationRule);
    this.getHourPaymentRules();
    if (this.ruleApply) {
      this.refund = (this.order?.amount * this.ruleApply.value) / 100;
      if (this.refund === 0) {
        this.refund = this.order.amount;
      }
    }
  }

  private getHourPaymentRules() {
    let createdPaymentDate = moment(this.order.createdAt).utc(true);
    let todayDate = moment().utc(true);
    let diffHours = todayDate.diff(createdPaymentDate, 'hour');
    this.ruleApply = this.cancellationRule.find((canX) => {
      if (canX.minHour <= diffHours && canX.maxHour >= diffHours) {
        return canX;
      }
    });
  }

  onCancelar() {
    // console.log('CancelOrderComponent -> onCancelar -> this.order.payemntType', this.order.payemntType);
    this.spinner.show();
    const cancelNote = this.form?.value?.cancelNote;
    let body = { id: this.order.id, cancelNote: cancelNote };
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
