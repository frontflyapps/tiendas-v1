import { DummyPipe } from './dummy.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParseLangPipe } from './parse-lang.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeResourseUrlPipe } from './safe-resource-url.pipe';
import { ParsePriceProduct } from './parse-price-product.pipe';
import { CurrencyMarket } from './currency-market.pipe';

@NgModule({
  declarations: [ParseLangPipe, SafeHtmlPipe, SafeResourseUrlPipe, DummyPipe, ParsePriceProduct, CurrencyMarket],
  imports: [CommonModule],
  exports: [ParseLangPipe, SafeHtmlPipe, SafeResourseUrlPipe, DummyPipe, ParsePriceProduct, CurrencyMarket],
  providers: [DummyPipe],
})
export class PipesModule {}
