import { DummyPipe } from './dummy.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParseLangPipe } from './parse-lang.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeResourseUrlPipe } from './safe-resource-url.pipe';

@NgModule({
  declarations: [ParseLangPipe, SafeHtmlPipe, SafeResourseUrlPipe, DummyPipe],
  imports: [CommonModule],
  exports: [ParseLangPipe, SafeHtmlPipe, SafeResourseUrlPipe, DummyPipe],
  providers: [DummyPipe],
})
export class PipesModule {}
