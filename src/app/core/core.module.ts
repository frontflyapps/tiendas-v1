import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShowSnackbarService } from './services/show-snackbar/show-snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CapitalizeFirstDirective } from './directives/capitalize-first.directive';

@NgModule({
  declarations: [CapitalizeFirstDirective],
  imports: [CommonModule, HttpClientModule, MatSnackBarModule],
  providers: [ShowSnackbarService],
})
export class CoreModule {
}
