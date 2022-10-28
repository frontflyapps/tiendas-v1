import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebounceClickDirective } from './debounce-click.directive';

@NgModule({
  declarations: [DebounceClickDirective],
  exports: [DebounceClickDirective],
  imports: [CommonModule],
})
export class DebounceClickModule {}
