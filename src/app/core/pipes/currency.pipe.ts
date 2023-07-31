import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CoinEnum } from '../classes/coin.enum';
import { MarketEnum } from '../classes/market.enum';

@Pipe({
  name: 'currencyProduct',
})
export class CurrencyProductPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(price: number, currency: string): string {
    let newCurrency;
    switch (currency) {
      case 'USD': {
        newCurrency = CoinEnum.USD;
        break;
      }
      case 'EUR': {
        newCurrency = CoinEnum.EUR;
        break;
      }
      case 'CUP': {
        newCurrency = CoinEnum.CUP;
        break;
      }
    }
    const newPrice = this.currencyPipe.transform(price, currency, 'code');

    return  newPrice;
  }
}
