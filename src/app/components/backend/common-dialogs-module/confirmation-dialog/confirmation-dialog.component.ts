import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  question = '';
  isSaving = false;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.question = data.question || '';
  }

  ngOnInit() {
    document.getElementById('innerTextQuetion').innerHTML = this.question;
    this.dialogRef.backdropClick().subscribe(() => {
      if (!this.isSaving) {
        this.dialogRef.close();
      }
    });
  }

  onSave() {
    this.isSaving = true;
    this.dialogRef.close(true);
  }
}
