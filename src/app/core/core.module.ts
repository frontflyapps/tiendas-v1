import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShowSnackbarService } from './services/show-snackbar/show-snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CapitalizeFirstDirective } from './directives/capitalize-first.directive';
import { LazyImgModule } from './directives/lazy-img/lazy-img.module';

@NgModule({
  declarations: [CapitalizeFirstDirective],
  imports: [CommonModule, HttpClientModule, MatSnackBarModule, LazyImgModule],
  providers: [ShowSnackbarService],
})
export class CoreModule {
}
