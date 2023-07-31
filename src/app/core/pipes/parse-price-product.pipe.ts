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
    if (product.currency !== null) {
      switch (product.currency) {
        case 'USD': {
          currency = CoinEnum.USD;
          break;
        }
        case 'EUR': {
          currency = CoinEnum.EUR;
          break;
        }
        case 'CUP': {
          currency = CoinEnum.CUP;
          break;
        }
      }
    } else {
      if (product.market == MarketEnum.INTERNATIONAL) {
        currency = CoinEnum.USD;
      }
      if (product.market == MarketEnum.NATIONAL) {
        currency = CoinEnum.CUP;
      }
    }

    if (type) {
      const minPrice = this.currency.transform(product.limitMinOffersPrice, currency, 'code');
      const maxPrice = this.currency.transform(product.limitMaxOffersPrice, currency, 'code');
      if (product.limitMinPrice == product.limitMaxPrice) {
        return minPrice;
      } else {
        return `(${minPrice} - ${maxPrice})`;
      }
    } else {
      const minPrice = this.currency.transform(product.limitMinPrice, currency, 'code');
      const maxPrice = this.currency.transform(product.limitMaxPrice, currency, 'code');
      if (product.limitMinPrice == product.limitMaxPrice) {
        return minPrice;
      } else {
        return `(${minPrice} - ${maxPrice})`;
      }
    }
  }
}
