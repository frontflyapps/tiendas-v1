import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CurrencyService } from './../../../../core/services/currency/currency.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit {
  public priceFrom: number = 1;
  public priceTo: number = 2000;
  priceForm: FormGroup;
  // Using Output EventEmitter
  @Output() priceFilters = new EventEmitter();
  @Input() set reset(value) {
    if (value && this.priceForm) {
      this.priceForm.get('priceFrom').setValue(0.0);
      this.priceForm.get('priceTo').setValue(10000);
    }
  }

  // define min, max and range
  public min: number = 100;
  public max: number = 2000;
  public range = [100, 2000];

  constructor(public currencyService: CurrencyService, private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit() {
    this.buildPriceForm();
    this.priceForm.valueChanges.subscribe((data) => {
      if (this.priceForm.get('priceTo').valid) {
        this.priceForm.get('priceFrom').setValidators(Validators.max(this.priceForm.get('priceTo').value - 1));
      }
      if (this.priceForm.get('priceFrom').valid) {
        this.priceForm.get('priceTo').setValidators(Validators.min(this.priceForm.get('priceFrom').value + 1));
      }
    });
  }

  buildPriceForm() {
    this.priceForm = this.fb.group({
      priceFrom: [this.route.snapshot?.queryParams.minPrice || 0.0, [Validators.required, Validators.min(0)]],
      priceTo: [this.route.snapshot?.queryParams.maxPrice || 10000.0, [Validators.required]],
    });
  }

  priceFilter() {
    // console.log('PriceComponent -> priceFilter -> this.priceForm', this.priceForm);
    if (this.priceForm.valid) {
      this.priceFilters.emit({
        ...this.priceForm.value,
      });
    }
  }
}
