import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CoinEnum } from '../classes/coin.enum';
import { MarketEnum } from '../classes/market.enum';

@Pipe({
  name: 'parsePriceProduct',
})
export class ParsePriceProduct implements PipeTransform {
  constructor(private currency: CurrencyPipe) {
  }

  transform(product: any, type?: any): string {
    let currency;
    currency = CoinEnum.USD;
    if (product.market == MarketEnum.INTERNATIONAL) {
      currency = CoinEnum.USD;
    }
    if (product.market == MarketEnum.NATIONAL) {
      currency = CoinEnum.CUP;
    }
    if (type) {
      const minPrice = this.currency.transform(product.limitMinOffersPrice, currency);
      const maxPrice = this.currency.transform(product.limitMaxOffersPrice, currency);
      if (product.limitMinPrice == product.limitMaxPrice) {
        return minPrice;
      } else {
        return `(${minPrice} - ${maxPrice})`;
      }
    } else {
      const minPrice = this.currency.transform(product.limitMinPrice, currency);
      const maxPrice = this.currency.transform(product.limitMaxPrice, currency);
      if (product.limitMinPrice == product.limitMaxPrice) {
        return minPrice;
      } else {
        return `(${minPrice} - ${maxPrice})`;
      }
    }
  }
}
