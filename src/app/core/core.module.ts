
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from './services/layout/layout.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyService } from './services/currency/currency.service';
import { UtilsService } from './services/utils/utils.service';
import { PreviousRouteService } from './services/previous-route/previous-route.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { ExportExcelService } from './services/export-excel/export-excel.service';
import { ShowSnackbarService } from './services/show-snackbar/show-snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ShowToastrService } from './services/show-toastr/show-toastr.service';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [
    LayoutService,
    CurrencyService,
    UtilsService,
    ShowToastrService,
    PreviousRouteService,
    AuthenticationService,
    ExportExcelService,
    ShowSnackbarService

  ]
})
export class CoreModule { }
