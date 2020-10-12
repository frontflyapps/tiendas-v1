import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, take, takeUntil } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { environment } from './../../../../../../environments/environment';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recomended-products',
  templateUrl: './recomended-products.component.html',
  styleUrls: ['./recomended-products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RecomendedProductsComponent implements OnInit, OnDestroy, OnChanges {
  _unsubscribeAll: Subject<any>;
  @Input() language;
  @Input() productId;
  @Input() saveInternal = true; /// Define if a save Btn is internal/external
  @Input() recomendedProducts: any[];
  @Output() $recomendedProductChange: EventEmitter<any> = new EventEmitter();

  ////////////////////// CHIP RECOMENDED PRODUCTSS /////////////////////
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  recomendedProductCtrl = new FormControl();
  filteredProducts: any[] = [];
  allProduct: any[] = [];
  imageUrl: any;

  @ViewChild('recomendedProductInput') recomendedProductInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ///////////////////////////////////////////////////////////////

  constructor(
    private productService: ProductService,
    private translate: TranslateService,
    private utilsService: UtilsService,
  ) {
    this._unsubscribeAll = new Subject();
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit() {
    this.productService.getAllAdminProducts({ limit: 10000, offset: 0 }, { status: 'published' }).subscribe(
      (data) => {
        this.allProduct = data.data;
        this.filteredProducts = this.allProduct.slice(0, 10);
      },
      (err) => {
        this.utilsService.errorHandle(err);
      },
    );

    this.recomendedProductCtrl.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      if (data) {
        this.filteredProducts = this._filter(data);
      } else {
        this.filteredProducts = this.allProduct.slice(0, 10);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.language) {
      this.language = changes.language.currentValue;
    }
    if (changes.productId) {
      this.productId = changes.productId.currentValue;
    }
    if (changes.recomendedProducts) {
      this.recomendedProducts = changes.recomendedProducts.currentValue;
      this.$recomendedProductChange.emit(this.recomendedProducts);
    }
    if (changes.saveInternal) {
      this.saveInternal = changes.saveInternal.currentValue;
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //////////////////FUNCTIONS INFILTER CHIPSSS///////////////////

  onAddRecomendedProduct(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        this.recomendedProducts.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.recomendedProductCtrl.setValue(null);
    }
  }

  remove(product: any): void {
    const index = this.recomendedProducts.indexOf(product);
    if (index >= 0) {
      this.recomendedProducts.splice(index, 1);
    }
    this.$recomendedProductChange.emit(this.recomendedProducts);
    this.onSetRecomended();
  }

  onSelectedRecomendedProduct(event: MatAutocompleteSelectedEvent): void {
    const selectedProduct = event.option.value;
    const searchValue = this.recomendedProducts.find((item) => item.id === selectedProduct.id);
    if (!searchValue) {
      this.recomendedProducts.push(event.option.value);
      this.$recomendedProductChange.emit(this.recomendedProducts);
      this.onSetRecomended();
    }
    this.recomendedProductInput.nativeElement.value = '';
    this.recomendedProductCtrl.setValue(null);
  }

  private _filter(value: string): any[] {
    if (value.constructor === String) {
      const filterValue = value.trim().toLowerCase();
      return this.allProduct.filter((item) => this._filterProduct(item, filterValue));
    } else {
      return [];
    }
  }

  private _filterProduct(product, searchValue) {
    const nameParams = product.name[this.language] ? product.name[this.language] : product.name['es'];
    const categoryParams = product.Category.name[this.language]
      ? product.Category.name[this.language]
      : product.Category.name['es'];
    const type = product.type;

    const priceParams = product.price + '';
    return (
      nameParams.toLowerCase().includes(searchValue.toLowerCase()) ||
      categoryParams.toLowerCase().includes(searchValue.toLowerCase()) ||
      type.toLowerCase().includes(searchValue.toLowerCase()) ||
      priceParams.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  onSetRecomended(): void {
    if (this.saveInternal) {
      let data = this.recomendedProducts.map((item) => item.id);
      this.productService.createRecomendedProduct(this.productId, { ids: data }).subscribe(
        (newRecomended) => {
          // this.showSnackbar.showSucces(this.translate.instant('The recomended products has been changed successfully', 6000));
        },
        (error) => {
          this.utilsService.errorHandle(error);
        },
      );
    }
  }
}
