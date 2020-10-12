import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ShowSnackbarService } from '../../../../../core/services/show-snackbar/show-snackbar.service';
import { environment } from '../../../../../../environments/environment';
import { LoggedInUserService } from '../../../../../core/services/loggedInUser/logged-in-user.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaxesShippingService } from '../../../services/taxes-shipping/taxes-shipping.service';
import { RegionsService } from '../../../services/regions/regions.service';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-dialog-add-shipping',
  templateUrl: './dialog-add-shipping.component.html',
  styleUrls: ['./dialog-add-shipping.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddShippingComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedShipping: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  priceForm: FormArray;
  allProvinces: any[] = [];
  municipalities: any[] = [];
  allMunicipalities: any[] = [];
  isBasicInfoChanged = false;
  allProducts: any[] = [];
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  allCountries: any[] = [];
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddShippingComponent>,
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

    this.isEditing = data.isEditing;
    this.selectedShipping = data.selectedShipping;
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // --------------------------------------------------------------------------------------------------
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
    this.fetchDaTa();
    this.createForm();
    this.form.valueChanges.subscribe((data) => {
      this.isBasicInfoChanged = true;
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      ProvinceId: [null, [Validators.required]],
      CountryId: [59, [Validators.required]],
      MunicipalityIds: [null, [Validators.required, Validators.minLength(1)]],
      ProductIds: [null, [Validators.required, Validators.minLength(1)]],
      generalPrice: [0.0, [Validators.required]],
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

  onPreparatePrices() {
    if (!this.isBasicInfoChanged) {
      return;
    }
    this.priceForm = new FormArray([]);
    let municipalities = [...this.form.get('MunicipalityIds').value];
    let products = [...this.form.get('ProductIds').value];
    for (let municipality of municipalities) {
      let tempForm = this.fb.group({
        Municipality: municipality,
        MunicipalityId: municipality.id,
        ProvinceId: this.form.get('ProvinceId').value,
        CountryId: this.form.get('CountryId').value,
      });
      let priceFormArray = new FormArray([]);
      for (let product of products) {
        priceFormArray.push(
          this.fb.group({
            Product: product,
            ProductId: product.id,
            price: [this.form.get('generalPrice').value, [Validators.required]],
          }),
        );
      }
      tempForm.setControl('prices', priceFormArray);
      this.priceForm.push(tempForm);
    }
    // console.log('CrearTarifaComponent -> onPreparatePrices -> this.dataForm', this.priceForm);
    this.isBasicInfoChanged = false;
  }

  getFormArray(form, key) {
    let dataForm = form.get(key) as FormArray;
    return dataForm;
  }

  onRemoveProduct(data: FormGroup, event) {
    if (event) {
      data.enable();
    } else {
      data.disable();
    }
    this.priceForm.updateValueAndValidity();
  }

  onDisabledAll(data: FormGroup, event) {
    let productPricesForm = data.get('prices') as FormArray;
    if (event) {
      productPricesForm.controls.map((item) => {
        item.enable();
      });
    } else {
      productPricesForm.controls.map((item) => {
        item.disable();
      });
    }
    productPricesForm.updateValueAndValidity();
    this.priceForm.updateValueAndValidity();
  }

  onSave(): void {
    this.spinner.show();
    let data = [...this.priceForm.value];
    let body = [];
    data.map((item) => {
      delete item.Municipality;
      if (item && item.prices) {
        item.prices = item.prices.map((p) => {
          delete p.Product;
          return p;
        });
        body.push(item);
      }
    });
    // console.log('onSave -> data', JSON.stringify(body));

    this.shippingService.createShipping(body).subscribe(
      () => {
        this.showSnackbar.showSucces(this.translate.instant('Shipping successfully created'));
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
