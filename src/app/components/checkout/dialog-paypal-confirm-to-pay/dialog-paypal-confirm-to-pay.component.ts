import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-paypal-confirm-to-pay',
  templateUrl: './dialog-paypal-confirm-to-pay.component.html',
  styleUrls: ['./dialog-paypal-confirm-to-pay.component.scss']
})
export class DialogPaypalConfirmToPayComponent implements AfterViewInit {

  templateInputs!: HTMLElement;

  constructor(
    public dialogRef: MatDialogRef<DialogPaypalConfirmToPayComponent>,
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

