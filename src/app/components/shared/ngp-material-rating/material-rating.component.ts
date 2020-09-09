import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface MatStarConfig {
  size?: string;
  colorFill?: string;
  label?: string;
  readOnly?: boolean;
  showNumber?: boolean;
  showClearBtn?: boolean;
  stars?: number;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngp-rating-material',
  templateUrl: './material-rating.component.html',
  styleUrls: ['./material-rating.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgpRatingMaterialComponent),
      multi: true,
    },
  ],
})
export class NgpRatingMaterialComponent implements ControlValueAccessor, OnInit {
  @Input() _rating = 0.0; // notice the '_
  @Input() set value(value) {
    this.rating = value;
  }

  _config: MatStarConfig = {
    size: '1rem',
    colorFill: '#ffc107',
    showNumber: false,
    readOnly: false,
    label: '',
    showClearBtn: false,
    stars: 5,
  };

  arrayFill = [];

  @Input() set config(value: MatStarConfig) {
    this.procesConfig(value);
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {}

  get rating() {
    return this._rating;
  }

  set rating(val) {
    this._rating = val;
    this.propagateChange(this._rating);
  }

  writeValue(value: any) {
    if (value !== undefined && value != '') {
      this.rating = value;
    }
  }

  procesConfig(value: MatStarConfig) {
    if (value && value.size) {
      this._config.size = value.size;
    }
    if (value && value.colorFill) {
      this._config.colorFill = value.colorFill;
    }
    if (value && value.readOnly) {
      this._config.readOnly = value.readOnly;
    }
    if (value && value.showNumber) {
      this._config.showNumber = value.showNumber;
    }
    if (value && value.label) {
      this._config.label = value.label;
    }
    if (value && value.showClearBtn) {
      this._config.showClearBtn = value.showClearBtn;
    }
    if (value && value.stars) {
      this._config.stars = value.stars;
    }
  }

  ngOnInit() {
    for (let i = 1; i <= this._config.stars; i++) {
      this.arrayFill.push(i);
    }
  }

  onMark(item) {
    if (this._config.readOnly) {
      return;
    }
    if (item != this.rating) {
      this.rating = +item;
      return;
    }
    if (item == this.rating) {
      this.rating -= 0.5;
      return;
    }
  }

  onClear() {
    if (this._config.readOnly) {
      return;
    }
    this.rating = 0.0;
  }
}
