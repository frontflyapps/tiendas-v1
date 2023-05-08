import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from './footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FooterComponent],
  exports: [FooterComponent],
  imports: [
    MatSelectModule,
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    MatGridListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    MatTooltipModule,
  ],
})
export class FooterModule {
}
