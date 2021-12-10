import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogFrontComponent } from './confirmation-dialog-front.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfirmationDialogFrontComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, FlexLayoutModule],
  exports: [ConfirmationDialogFrontComponent],
})
export class ConfirmationDialogFrontModule {
}
