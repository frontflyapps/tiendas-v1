import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CoinEnum } from '../classes/coin.enum';
import { MarketEnum } from '../classes/market.enum';

@Pipe({
  name: 'currencyMarket',
})
export class CurrencyMarket implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(price: number, market: string): string {
    let currency;
    currency = CoinEnum.USD;
    if (market == MarketEnum.INTERNATIONAL || market == CoinEnum.USD) {
      currency = CoinEnum.USD;
    } else if (market == MarketEnum.NATIONAL || market == CoinEnum.CUP) {
      currency = CoinEnum.CUP;
    } else if (market == CoinEnum.EUR) {
      currency = CoinEnum.EUR;
    }
    const data = this.currencyPipe.transform(price, currency, 'code');
    return data;
  }
}
