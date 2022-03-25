import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-bidaiondo-cancel-to-pay',
  templateUrl: './dialog-bidaiondo-cancel-to-pay.component.html',
  styleUrls: ['./dialog-bidaiondo-cancel-to-pay.component.scss'],
})
export class DialogBidaiondoCancelToPayComponent implements AfterViewInit {
  templateInputs;

  constructor(
    public dialogRef: MatDialogRef<DialogBidaiondoCancelToPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngAfterViewInit() {
    this.templateInputs = document.getElementById('inputsHiddenBid');
    this.templateInputs.innerHTML = this.data.form;
  }

  close() {
    this.dialogRef.close();
  }
}
