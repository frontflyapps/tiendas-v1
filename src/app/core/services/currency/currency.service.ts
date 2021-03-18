import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  public currencies: any[] = [
    { name: 'CUP', code: 'CUP' },
    { name: 'USD', code: 'USD' },
  ];

  currency: any;

  constructor(private currencyPipe: CurrencyPipe) {
    let tempCurrency = JSON.parse(localStorage.getItem('currency'));
    if (tempCurrency) {
      tempCurrency = this.currencies.find((item) => item.name == tempCurrency.name);
      this.currency = tempCurrency ? tempCurrency : this.currencies[0];
    } else {
      this.currency = this.currencies[0];
    }
    localStorage.setItem('currency', JSON.stringify(this.currency));
  }

  public setCurrency(currency) {
    this.currency = currency;
    localStorage.setItem('currency', JSON.stringify(currency));
  }

  public getCurrency() {
    const tempCurrency = JSON.parse(localStorage.getItem('currency'));
    this.currency = tempCurrency ? tempCurrency : this.currencies[0];
    return this.currency;
  }

  public getCurrencies() {
    return this.currencies;
  }

  public getPriceLabel(product) {
    const currencyCode = this.getCurrency();
    const minPrice = this.currencyPipe.transform(product.limitMinPrice, currencyCode.code);
    const maxPrice = this.currencyPipe.transform(product.limitMaxPrice, currencyCode.code);
    if (product.limitMinPrice == product.limitMaxPrice) {
      return minPrice;
    } else {
      return `(${minPrice} - ${maxPrice})`;
    }
  }

  public getOfferLabel(product) {
    const currencyCode = this.getCurrency();
    const minPrice = this.currencyPipe.transform(product.limitMinOffersPrice, currencyCode.code);
    const maxPrice = this.currencyPipe.transform(product.limitMaxOffersPrice, currencyCode.code);
    if (product.limitMinOffersPrice == product.limitMaxOffersPrice) {
      return minPrice;
    } else {
      return `(${minPrice} - ${maxPrice})`;
    }
  }
}
