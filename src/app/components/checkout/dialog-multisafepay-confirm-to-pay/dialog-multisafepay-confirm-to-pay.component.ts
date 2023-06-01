import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-multisafepay-confirm-to-pay',
  templateUrl: './dialog-multisafepay-confirm-to-pay.component.html',
  styleUrls: ['./dialog-multisafepay-confirm-to-pay.component.scss']
})
export class DialogMultisafepayConfirmToPayComponent implements AfterViewInit {

  templateInputs!: HTMLElement;

  constructor(
    public dialogRef: MatDialogRef<DialogMultisafepayConfirmToPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngAfterViewInit(): void {
    this.templateInputs = document.getElementById('inputsHiddenBid')!;
  }

  close(): void {
    this.dialogRef.close();
  }
}
