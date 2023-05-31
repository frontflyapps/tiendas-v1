import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogCaptchaComponent } from './dialog-captcha.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { DialogCaptchaRoutingModule } from './dialog-captcha-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    DialogCaptchaComponent
  ],
  imports: [
    CommonModule,
    DialogCaptchaRoutingModule,
    FlexLayoutModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    MatCardModule,
    MatDividerModule,
    MatButtonToggleModule,
    PipesModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    DialogCaptchaComponent
  ],
})
export class DialogCaptchaModule { }
