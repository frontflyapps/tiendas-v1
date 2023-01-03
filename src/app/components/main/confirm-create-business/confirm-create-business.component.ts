import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-confirm-create-business',
  templateUrl: './confirm-create-business.component.html',
  styleUrls: ['./confirm-create-business.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmCreateBusinessComponent implements OnInit {
  innerWidth: any;
  applyStyle = false;
  bussiness = environment.address;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmCreateBusinessComponent>,
  ) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  ngOnInit(): void {
    this.onResize('event');
  }
}
