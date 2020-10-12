import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailsComponent implements OnInit {
  @Input() set _selectedOrder(value) {
    this.selectedOrder = { ...value };
    this.selectedOrder.fullAddress = this.selectedOrder.address + ', ';
    if (this.selectedOrder.CountryId == 59) {
      this.selectedOrder.fullAddress +=
        this.selectedOrder.Municipality?.name +
        this.selectedOrder.Province?.name +
        this.selectedOrder.Country?.name['es'];
    } else {
      this.selectedOrder.fullAddress +=
        this.selectedOrder.city + this.selectedOrder.regionProvinceState + this.selectedOrder.Country?.name['es'];
    }
  }

  selectedOrder: any = null;

  constructor(public currencyService: CurrencyService) {}

  ngOnInit() {}
}
