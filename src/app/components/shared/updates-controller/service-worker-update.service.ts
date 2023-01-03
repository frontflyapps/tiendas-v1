import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import Cookies from 'js-cookie';

import { concat, interval, Subject } from 'rxjs';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogReloadAppComponent } from './dialog-reload-app/dialog-reload-app.component';
import { first } from 'rxjs/operators';

// ============================================================================
// == CONFIG, PARA NOTIFICACION VISIBLE EN CAMBIO DE VERSION, (true or false)
// .
export let TIME_TO_REFRESH = 20 * 1000;
export let NOTIFICATION_VISIBLE = true;
// .
// ============================================================================

@Injectable()
export class ServiceWorkerUpdateService {
  public $updatedVersion = new Subject<any>();

  constructor(
    private appRef: ApplicationRef,
    public updates: SwUpdate,
    public dialog: MatDialog,
  ) {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everyXHours$ = interval(TIME_TO_REFRESH);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everyXHours$);

    if (NOTIFICATION_VISIBLE) {
      everySixHoursOnceAppIsStable$.subscribe(() => this.checkForUpdates());
    }

    if (!NOTIFICATION_VISIBLE) {
      everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
    }

    this.$updatedVersion.subscribe(() => {
      this.onShowReloadDialog();
    });
  }

  importDialogReloadModule(): void {
    import('./dialog-reload-app/dialog-reload-app.module').then((m) => m.DialogReloadAppModule);
  }

  onShowReloadDialog() {
    this.importDialogReloadModule();
    const config: MatDialogConfig = {
      disableClose: true,
      hasBackdrop: true,
      width: '30rem',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        isEditing: false,
        selectedService: null,
      },
    };

    const dialogRef: MatDialogRef<DialogReloadAppComponent, any>
      = this.dialog.open(DialogReloadAppComponent, config);

    dialogRef.afterClosed().subscribe(() => {
      document.location.reload();

      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove('account');

    });
  }

  private checkForUpdates(): void {
    console.warn('--> checking update...');
    this.updates.available.subscribe((event) => {
      this.promptUser();
    });
  }

  private promptUser(): void {
    console.warn('--> updating to new version');
    this.updates.activateUpdate().then(() => {
      this.$updatedVersion.next(true);
    });
  }
}
