import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '../../../../core/classes/user.class';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShowToastrService } from './../../../../core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-panel-notifications',
  templateUrl: './panel-notifications.component.html',
  styleUrls: ['./panel-notifications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PanelNotificationsComponent implements OnInit {
  innerWidth: any;
  applyStyle = false;
  urlImage: any = '';
  loggedInUser: IUser;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PanelNotificationsComponent>,
    private loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService,
  ) {
    this.urlImage = environment.imageUrl;
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
