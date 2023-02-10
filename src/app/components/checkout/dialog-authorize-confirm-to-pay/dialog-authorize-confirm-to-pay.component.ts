import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-authorize-confirm-to-pay',
  templateUrl: './dialog-authorize-confirm-to-pay.component.html',
  styleUrls: ['./dialog-authorize-confirm-to-pay.component.scss']
})
export class DialogAuthorizeConfirmToPayComponent implements AfterViewInit {

  templateInputs!: HTMLElement;
  constructor(
    public dialogRef: MatDialogRef<DialogAuthorizeConfirmToPayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
  }

  ngAfterViewInit() {
    this.templateInputs = document.getElementById('inputsHiddenBid');
    this.templateInputs.innerHTML = this.data.form;
  }

  close() {
    this.dialogRef.close();
  }

}
