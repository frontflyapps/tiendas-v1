import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class ShowSnackbarService {

  constructor(public snackBar: MatSnackBar) {

  }

  showError(msj, timeout?) {
    timeout = (timeout) ? timeout : 5000;
    this.snackBar.open(msj, '×', { panelClass: ['error'], verticalPosition: 'top', duration: timeout });
  }

  showSucces(msj, timeout?) {
    timeout = (timeout) ? timeout : 5000;
    this.snackBar.open(msj, '×', { panelClass: ['succes'], verticalPosition: 'top', duration: timeout });
  }

  showInfo(msj, secundary?, timeout?) {

  }


}
