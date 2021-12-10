import { NgpRatingMaterialComponent } from './material-rating.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [NgpRatingMaterialComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [NgpRatingMaterialComponent],
})
export class NgpMaterialRatingModule {
}
