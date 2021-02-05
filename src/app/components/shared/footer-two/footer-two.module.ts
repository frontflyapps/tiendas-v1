import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { FooterTwoComponent } from './footer-two.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [FooterTwoComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    MatMenuModule,
    TranslateModule,
    RouterModule,
    MatButtonModule,
  ],
  exports: [FooterTwoComponent],
})
export class FooterTwoModule {}
