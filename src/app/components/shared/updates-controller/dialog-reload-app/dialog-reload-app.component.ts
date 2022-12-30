import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-dialog-reload-app',
  templateUrl: './dialog-reload-app.component.html',
  styleUrls: ['./dialog-reload-app.component.scss'],
})
export class DialogReloadAppComponent {
  innerWidth: any;
  applyStyle = false;
  unsubscribeAll: Subject<any>;

  version = environment.versions.app;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogReloadAppComponent>,
    public dialog: MatDialog,
    public translateService: TranslateService,
  ) {
    this.dialogRef.disableClose = true;
    this.unsubscribeAll = new Subject<any>();
  }

  onClose(): void {
    this.dialogRef.close(true);
  }
}
