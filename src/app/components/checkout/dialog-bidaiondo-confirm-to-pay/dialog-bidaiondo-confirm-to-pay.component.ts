import { AfterViewInit, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-bidaiondo-confirm-to-pay',
  templateUrl: './dialog-bidaiondo-confirm-to-pay.component.html',
  styleUrls: ['./dialog-bidaiondo-confirm-to-pay.component.scss'],
})
export class DialogBidaiondoConfirmToPayComponent implements AfterViewInit {
  templateInputs;

  constructor(
    public dialogRef: MatDialogRef<DialogBidaiondoConfirmToPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log('Pay Bidaiondo');
  }

  ngAfterViewInit() {
    this.templateInputs = document.getElementById('inputsHiddenBid');
    this.templateInputs.innerHTML = this.data.form;
  }

  close() {
    this.dialogRef.close();
  }
}
