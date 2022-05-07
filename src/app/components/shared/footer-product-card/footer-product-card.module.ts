import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterProductCardComponent } from './footer-product-card/footer-product-card.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GuachosRatingModule } from 'guachos-rating';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '../../../core/pipes/pipes.module';


@NgModule({
  declarations: [FooterProductCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    GuachosRatingModule,
    FlexModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PipesModule,
  ],
  exports: [FooterProductCardComponent],
})
export class FooterProductCardModule {
}
