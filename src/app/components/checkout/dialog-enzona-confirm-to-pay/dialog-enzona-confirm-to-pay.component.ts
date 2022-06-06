import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-enzona-confirm-to-pay',
  templateUrl: './dialog-enzona-confirm-to-pay.component.html',
  styleUrls: ['./dialog-enzona-confirm-to-pay.component.scss'],
})
export class DialogEnzonaConfirmToPayComponent implements OnInit {
  loggedInUser: any;
  launchTM: any;
  link: any = undefined;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEnzonaConfirmToPayComponent>,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.link = data.link;
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    const templateInputs: any = document.getElementById('inputsHiddenBid');
    templateInputs.href = this.link;
  }

  close() {
    this.dialogRef.close();
  }

  onEnzonaLoad() {
    this.loading = true;
    this.spinner.show();
  }
}
