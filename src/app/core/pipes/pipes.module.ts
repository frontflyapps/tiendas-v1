import { DummyPipe } from './dummy.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParseLangPipe } from './parse-lang.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafeResourseUrlPipe } from './safe-resource-url.pipe';
import { ParsePriceProduct } from './parse-price-product.pipe';
import { CurrencyMarket } from './currency-market.pipe';
import { CurrencyCheckoutPipe } from './currency-checkout.pipe';
import { I18nFieldPipe } from './i18n-field.pipe';
import { CurrencyProductPipe } from './currency.pipe';

@NgModule({
  declarations: [
    ParseLangPipe,
    SafeHtmlPipe,
    SafeResourseUrlPipe,
    DummyPipe,
    ParsePriceProduct,
    CurrencyMarket,
    I18nFieldPipe,
    CurrencyCheckoutPipe,
    CurrencyProductPipe
  ],
  imports: [CommonModule],
  exports: [
    ParseLangPipe,
    SafeHtmlPipe,
    SafeResourseUrlPipe,
    DummyPipe,
    ParsePriceProduct,
    CurrencyMarket,
    CurrencyCheckoutPipe,
    CurrencyProductPipe,
    I18nFieldPipe
  ],
  providers: [DummyPipe],
})
export class PipesModule {
}
