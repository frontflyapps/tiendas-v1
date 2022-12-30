import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pgt-confirm-to-pay',
  templateUrl: './dialog-pgt-confirm-to-pay.component.html',
  styleUrls: ['./dialog-pgt-confirm-to-pay.component.scss']
})
export class DialogPgtConfirmToPayComponent implements AfterViewInit {
  templateInputs!: HTMLElement;

  constructor(
    public dialogRef: MatDialogRef<DialogPgtConfirmToPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngAfterViewInit(): void {
    this.templateInputs = document.getElementById('inputsHiddenBid')!;
    this.templateInputs.innerHTML = this.data.form;
  }

  close(): void {
    this.dialogRef.close();
  }
}

