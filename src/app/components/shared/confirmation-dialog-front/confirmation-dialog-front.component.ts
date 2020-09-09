import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-front',
  templateUrl: './confirmation-dialog-front.component.html',
  styleUrls: ['./confirmation-dialog-front.component.scss'],
})
export class ConfirmationDialogFrontComponent implements OnInit {
  question = '';
  isSaving = false;
  textHtml = null;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogFrontComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      if (!this.isSaving) {
        this.dialogRef.close();
      }
    });

    if (this.data.textHtml) {
      document.getElementById('textHtml').innerHTML = this.data.textHtml;
    }
  }

  onSave() {
    this.isSaving = true;
    this.dialogRef.close(true);
  }
}
