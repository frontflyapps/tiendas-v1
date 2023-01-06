import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuachosImageComponent } from './guachos-image.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GuachosImagePickerModule } from 'guachos-image-picker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [GuachosImageComponent],
  exports: [
    GuachosImageComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    GuachosImagePickerModule,
  ],
})
export class GuachosImageModule { }
