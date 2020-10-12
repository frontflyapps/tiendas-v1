import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-no-cart-selected',
  templateUrl: './no-cart-selected.component.html',
  styleUrls: ['./no-cart-selected.component.scss'],
})
export class DialogNoCartSelectedComponent implements OnInit {
  loggedInUser: any;
  launchTM: any;
  link: any = undefined;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogNoCartSelectedComponent>,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
