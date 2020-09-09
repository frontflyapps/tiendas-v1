import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ShowSnackbarService } from '../../../../../core/services/show-snackbar/show-snackbar.service';
import { environment } from '../../../../../../environments/environment';
import { LoggedInUserService } from '../../../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { Subject } from 'rxjs';
import { TaxesShippingService } from '../../../services/taxes-shipping/taxes-shipping.service';
import { RegionsService } from '../../../services/regions/regions.service';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-dialog-edit-shipping',
  templateUrl: './dialog-edit-shipping.component.html',
  styleUrls: ['./dialog-edit-shipping.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogEditShippingComponent implements OnInit, OnDestroy {
  isSaving = false;
  isChangedPricesState = false;
  loggedInUser: any;
  form: FormGroup;
  priceForm: FormArray;
  allProvinces: any[] = [];
  municipalities: any[] = [];
  allMunicipalities: any[] = [];
  allProducts: any[] = [];
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  allCountries: any[] = [];
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  selectedShipping;
  allStatus: any[] = [
    { id: 'enabled', name: 'Habilitado' },
    { id: 'disabled', name: 'Deshabilitado' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEditShippingComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private productService: ProductService,
    private regionService: RegionsService,
    private shippingService: TaxesShippingService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();
    this.selectedShipping = data.selectedShipping;
    console.log('DialogEditShippingComponent -> this.selectedShipping', this.selectedShipping);
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // --------------------------------------------------------------------------------------------------
  }

  ngOnInit(): void {
    this.fetchDaTa();
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      ProvinceId: [this.selectedShipping.ProvinceId, [Validators.required]],
      CountryId: [this.selectedShipping.CountryId, [Validators.required]],
      MunicipalityId: [this.selectedShipping.MunicipalityId, [Validators.required, Validators.minLength(1)]],
      status: [this.selectedShipping.status],
      ProductIds: [
        this.selectedShipping?.ShippingProducts.map((i) => i.Product),
        [Validators.required, Validators.minLength(1)],
      ],
    });
    this.priceForm = new FormArray([]);
    for (let product of this.selectedShipping?.ShippingProducts) {
      this.priceForm.push(
        this.fb.group({
          Product: product.Product,
          ProductId: product.Product.id,
          price: [product.price, [Validators.required]],
        }),
      );
    }
    this.priceForm.valueChanges.subscribe(() => {
      this.isChangedPricesState = true;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  fetchDaTa() {
    this.regionService.getProvinces().subscribe((data) => {
      this.allProvinces = data.data;
    });

    this.regionService.getMunicipalities().subscribe((data) => {
      this.allMunicipalities = data.data;
      this.municipalities = this.allMunicipalities.filter(
        (item) => item.ProvinceId == this.form.get('ProvinceId').value,
      );
    });

    this.productService.getAllAdminProducts().subscribe((data) => {
      this.allProducts = data.data;
      this.allProducts = this.allProducts.sort(function (a, b) {
        return a.name['es'] > b.name['es'] ? 1 : a.name['es'] < b.name['es'] ? -1 : 0;
      });
    });

    this.regionService.getAllCountries({ limit: 10000, offset: 0, order: 'name' }).subscribe(
      (data) => {
        this.allCountries = data.data.filter((item) => item.name.es != undefined);
        this.allCountries = this.allCountries.sort(function (a, b) {
          if (a.name['es'] > b.name['es']) {
            return 1;
          } else if (a.name['es'] < b.name['es']) {
            return -1;
          } else {
            return 0;
          }
        });
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  onSelectProvince(provinceId) {
    this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    this.form.get('MunicipalityIds').setValue(null);
  }

  onSelectAllMunicipalities() {
    this.form.get('MunicipalityIds').setValue(this.municipalities.map((i) => i));
  }
  //////////////////////////////////////////

  onChangeProduct() {
    console.log('asdasdso');
    this.onPreparatePrices();
  }

  onPreparatePrices() {
    this.isChangedPricesState = true;
    let _priceForm = new FormArray([]);
    let products = this.form.get('ProductIds').value;
    for (let product of products) {
      let findProduct = this.priceForm.controls.find((item) => item.get('ProductId').value == product.id);
      if (findProduct == undefined) {
        _priceForm.push(
          this.fb.group({
            Product: product,
            ProductId: product.id,
            price: [0.0, [Validators.required]],
          }),
        );
      } else {
        _priceForm.push(
          this.fb.group({
            Product: product,
            ProductId: product.id,
            price: [findProduct.get('price').value, [Validators.required]],
          }),
        );
      }
    }
    this.priceForm = _priceForm;
  }

  getFormArray(form, key) {
    let dataForm = form.get(key) as FormArray;
    return dataForm;
  }

  onRemoveProduct(data: FormGroup, event) {
    this.isChangedPricesState = true;
    if (event) {
      data.enable();
    } else {
      data.disable();
    }
    this.priceForm.updateValueAndValidity();
  }

  onSave(): void {
    this.spinner.show();
    let dataPrices = [...this.priceForm.value];
    let dataForm = this.form.value;
    dataForm.id = this.selectedShipping.id;
    if (this.isChangedPricesState) {
      dataForm.prices = dataPrices;
    }

    this.shippingService.editShipping(dataForm).subscribe(
      () => {
        this.showSnackbar.showSucces(this.translate.instant('tarifa de envío editada'));
        this.spinner.hide();
        this.dialogRef.close(true);
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      },
    );
  }

  ////////////////////////////UTILS FOR LANGUAGE HANDLE///////////////////////////////////////
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }
  compareById(a1: any, a2: any) {
    return a1 && a2 && a1.id == a2.id;
  }

  parseLanguaje(data, lang) {
    // data.name = { [lang]: data.name };
    data.description = { [lang]: data.description };
    return data;
  }

  parseLanguajeEdit(data, oldData, lang) {
    // oldData.name[lang] = data.name;
    oldData.description[lang] = data.description;
    // data.name = oldData.name;
    data.description = oldData.description;
    return data;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
