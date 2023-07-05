import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyCheckout',
})
export class CurrencyCheckoutPipe implements PipeTransform {
  constructor(private currency: CurrencyPipe) {
  }

  transform(data: any): number {
    return data.value * data.rate;
    // if (data.currency === 'EUR') {
    //   return data.value * data.rate;
    // } else if (data.currency === 'CUP') {
    //   return data.value * data.rate;
    // } else {
    //   return data.value;
    // }
  }
}
