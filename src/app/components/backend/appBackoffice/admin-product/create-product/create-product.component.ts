import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ProductService } from '../../../../shared/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CategoriesService } from '../../../services/categories/catagories.service';
import { IUser } from './../../../../../core/classes/user.class';
import { environment } from './../../../../../../environments/environment';
import { StateCreatingProductService } from '../../../services/state-creating-product/state-creating-product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogUploadMediaComponent } from '../dialog-upload-media/dialog-upload-media.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProductComponent implements OnInit, OnDestroy {
  Brands: any[] = [];
  Categories: any[] = [];
  stepIndex = 0;
  BasicInfo: FormGroup;
  physicalProductForm: FormGroup;
  digitallProductForm: FormGroup;
  serviceProductForm: FormGroup;
  ProductData: FormGroup;
  imagesDataProduct: any[] = [];
  uploadDigitalProduct = environment.uploadDigitalProduct;
  uploadServicesProduct = environment.uploadServicesProduct;
  typesProducts = [
    { id: 'physical', name: { es: 'Físico', en: 'Physical' } },
    { id: 'digital', name: { es: 'Digital', en: 'Digital' } },
    { id: 'service', name: { es: 'Servicio', en: 'Service' } },
  ];

  formatTypes: any[] = [
    { id: 'audio', name: { es: 'Audio', en: 'Audio' } },
    { id: 'video', name: { es: 'Video', en: 'Video' } },
    { id: 'image', name: { es: 'Imagen', en: 'Imagen' } },
    { id: 'pdf', name: { es: 'Pdf', en: 'Pdf' } },
    { id: 'file', name: { es: 'Archivo', en: 'File' } },
  ];

  constactInfoType: any[] = [
    { id: 'email', name: { es: 'Correo', en: 'Email' } },
    { id: 'phone', name: { es: 'Teléfono', en: 'Phone' } },
  ];

  stepPass = 0;
  imageUrl = null;
  loggedInUser: IUser = null;
  productCreated: any = null;
  language = null;
  _unsubscribeAll: Subject<any>;
  languages: any[] = [];
  languageForm: FormControl;
  firstStateChanged = false;
  recomendedProducts: any[] = [];
  recomendedProductsOutput: any[] = [];
  tags: any[] = [];
  @ViewChild('stepper') stepper: any;
  typeProduct = 'physical';
  editorValue = null;
  description = null;
  ////////////////////////////////////////////
  name = 'ng2-ckeditor';
  ckeConfig: any;
  text: string;
  log: string = '';
  @ViewChild('myckeditor', { static: true }) ckeditor: any;
  pricesArray: FormArray;
  descriptionForm: FormControl = new FormControl(null, [Validators.required]);
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  show = false;
  constructor(
    private breadcrumbService: BreadcrumbService,
    private spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private loggedInUserService: LoggedInUserService,
    private showSnackbar: ShowSnackbarService,
    private translate: TranslateService,
    private stateProduct: StateCreatingProductService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private Location: Location,
    private fb: FormBuilder,
  ) {
    this.spinner.show();
    this._unsubscribeAll = new Subject<any>();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.languages = this.loggedInUserService.getlaguages();
    this.imageUrl = environment.imageUrl;
    this.productCreated = this.stateProduct.getProductCreated();
    // console.log('CreateProductComponent -> this.productCreated', this.productCreated);

    const tempLang = this.languages.find((item) => item.lang === 'es');
    this.languageForm = new FormControl(tempLang, []);
    this.language = 'es';
    if (!this.uploadDigitalProduct) {
      this.typesProducts = [
        { id: 'physical', name: { es: 'Físico', en: 'Physical' } },
        { id: 'service', name: { es: 'Servicio', en: 'Service' } },
      ];
    }
    if (!this.uploadServicesProduct) {
      this.typesProducts = [{ id: 'physical', name: { es: 'Físico', en: 'Physical' } }];
    }
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Products', false, '/backend/product/list');
    this.breadcrumbService.setBreadcrumd('Crear', true);

    this.buildForm();
    this.categoriesService.getAllBrands().subscribe((data) => {
      this.Brands = data.data;
    });

    this.categoriesService.getAllCategories().subscribe((data) => {
      this.Categories = data.data;
      this.Categories = this.Categories.sort(function (a, b) {
        return a.name['es'] > b.name['es'] ? 1 : a.name['es'] < b.name['es'] ? -1 : 0;
      });
    });

    /////////Subscriptions to change data//////////

    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });

    // this.BasicInfo.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
    //   this.firstStateChanged = true;
    // });

    this.BasicInfo.controls['minSale'].valueChanges.subscribe((data) => {
      this.BasicInfo.get('maxSale').setValidators(Validators.min(data));
      this.BasicInfo.get('maxSale').updateValueAndValidity();
      let arrayPrices = this.getArrayPrices();
      let form = arrayPrices[0];
      if (form) {
        form.get('min').setValue(data);
        arrayPrices.map((item, index) => {
          item.get('max').setValidators(Validators.min(item.get('min').value));
          item.get('max').updateValueAndValidity();
        });
      }
    });

    this.BasicInfo.controls['maxSale'].valueChanges.subscribe((data) => {
      let arrayPrices = this.getArrayPrices();
      let form = arrayPrices[arrayPrices.length - 1];
      if (form) {
        form.get('max').setValue(data);
        arrayPrices.map((item, index) => {
          item.get('max').setValidators(Validators.min(item.get('min').value));
          item.get('max').updateValueAndValidity();
        });
      }
    });

    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      defaultLanguage: 'es',
      height: '25rem',
    };
    /////////////////////////////////////////////
    this.route.queryParams.subscribe((data: any) => {
      console.log('CreateProductComponent -> ngOnInit -> data', data);
      if (data && data.type && this.productCreated == undefined) {
        this.BasicInfo.get('type').setValue(data.type);
        this.onTypesProductosChange({ value: data.type });
      }
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  buildForm(): void {
    this.BasicInfo = this.fb.group({
      type: [
        {
          value: this.productCreated ? this.productCreated.type : 'physical',
          disabled: this.productCreated != undefined,
        },
        [Validators.required],
      ],
      name: [
        this.productCreated ? this.productCreated.name[this.language] : null,
        [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required],
      ],
      shortDescription: [
        this.productCreated ? this.productCreated.shortDescription[this.language] : null,
        [
          Validators.minLength(10),
          Validators.pattern(/^\w((?!\s{2}).)*/),
          Validators.maxLength(250),
          Validators.required,
        ],
      ],
      CategoryId: [this.productCreated ? this.productCreated.CategoryId : null, Validators.required],
      rating: [this.productCreated ? this.productCreated.rating : 3.0, []],
      minSale: [this.productCreated ? this.productCreated.minSale : 1, [Validators.required, Validators.min(1)]],
      maxSale: [this.productCreated ? this.productCreated.maxSale : 100, [Validators.required, Validators.max(10000)]],
      PriceRange: new FormArray([]),
    });

    this.ProductData = this.fb.group({
      taxType: ['None', [Validators.required]],
      taxClass: [null, []],
    });

    if (this.productCreated) {
      this.productService.getRecomendedProduct(this.productCreated.id).subscribe((data: any) => {
        this.recomendedProducts = data.data;
      });
      this.tags = this.productCreated.tags;
      this.typeProduct = this.productCreated.type;
      if (this.productCreated.description) {
        this.description = this.productCreated.description[this.language]
          ? this.productCreated.description[this.language]
          : this.productCreated.description['es'];
        this.descriptionForm.setValue(this.description);
      }
      for (let data of this.productCreated.PriceRanges) {
        this.addPriceRange(data);
      }
    } else {
      this.addPriceRange();
    }

    this.buildTypeProductFrom(this.typeProduct);
    this.show = true;
    this.spinner.hide();
  }

  onTypesProductosChange(event) {
    this.typeProduct = event.value;
    this.buildTypeProductFrom(this.typeProduct);
  }

  buildTypeProductFrom(type) {
    if (type == 'physical') {
      this.physicalProductForm = this.fb.group({
        BrandId: [this.productCreated && this.productCreated.Physical ? this.productCreated.Physical.BrandId : null],
        stock: [
          this.productCreated && this.productCreated.Physical ? this.productCreated.Physical.stock : 0,
          [Validators.required, Validators.min(0), Validators.max(10000)],
        ],
        height: [this.productCreated ? this.productCreated.height : 0, []],
        width: [this.productCreated ? this.productCreated.width : 0, []],
        length: [this.productCreated ? this.productCreated.length : 0, []],
        weigth: [this.productCreated ? this.productCreated.weigth : 0, []],
        stockThreshold: [
          this.productCreated && this.productCreated.Physical ? this.productCreated.Physical.stockThreshold : 0,
          [Validators.required, Validators.min(0), Validators.max(50)],
        ],
        showStockQuantity: [
          this.productCreated && this.productCreated.Physical ? this.productCreated.Physical.showStockQuantity : false,
          [],
        ],
      });
    } else if (type == 'digital') {
      this.digitallProductForm = this.fb.group({
        previewUrl: [
          this.productCreated && this.productCreated.Digital ? this.productCreated.Digital.previewUrl : null,
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
          ),
        ],
        formatTypePreviewUrl: [
          this.productCreated && this.productCreated.Digital ? this.productCreated.Digital.formatTypePreviewUrl : null,
          [Validators.required],
        ],
        referenceUrl: [
          this.productCreated && this.productCreated.Digital ? this.productCreated.Digital.referenceUrl : null,
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
          ),
        ],
        formatTypereferenceUrl: [
          this.productCreated && this.productCreated.Digital
            ? this.productCreated.Digital.formatTypereferenceUrl
            : null,
          [Validators.required],
        ],
      });
    } else {
      this.serviceProductForm = this.fb.group({
        contactInfo: new FormArray([]),
      });
      if (this.productCreated && this.productCreated.Service) {
        this.productCreated.Service.contactInfo.map((item) => {
          this.addNewContactForService(
            this.fb.group({
              type: [item.type, [Validators.required]],
              contact: [item.contact, [Validators.required, Validators.pattern(/(^\+\d+$)|(^\d+$)/)]],
            }),
          );
        });
      } else {
        this.addNewContactForService();
      }
    }
    if (type && type != 'physical') {
      this.BasicInfo.get('minSale').setValue(1);
      this.BasicInfo.get('maxSale').setValue(1);
      this.BasicInfo.setControl('PriceRange', new FormArray([]));
      this.addPriceRange({ min: 1, max: 1, price: 1 });
    }
  }

  getFormArray(control: AbstractControl, key): FormArray {
    let data = control.get(key) as FormArray;
    return data;
  }

  addNewContactForService(form?) {
    let contactInfo: FormArray = this.serviceProductForm.controls.contactInfo as FormArray;
    if (form) {
      contactInfo.push(form);
    } else {
      contactInfo.push(
        this.fb.group({
          type: ['phone', [Validators.required]],
          contact: [null, [Validators.required, Validators.pattern(/(^\+\d+$)|(^\d+$)/)]],
        }),
      );
    }
  }

  onChangeType(form: FormControl, value) {
    if (value == 'email') {
      form.clearValidators();
      form.setValidators([Validators.required, Validators.email]);
    } else {
      form.clearValidators();
      form.setValidators([Validators.required, Validators.pattern(/(^\+\d+$)|(^\d+$)/)]);
    }
    form.updateValueAndValidity();
  }

  onRemoveContactService(index) {
    let contactInfo: FormArray = this.serviceProductForm.controls.contactInfo as FormArray;
    contactInfo.removeAt(index);
  }

  onArrayImagesChanged(event) {
    this.imagesDataProduct = event;
  }

  onClearStorage(): void {
    localStorage.removeItem('productCreated');
    this.productCreated = null;
    this.BasicInfo.reset();
    this.ProductData.reset();
  }

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  onAsignDescription() {
    this.spinner.show();
    let data = { description: {}, id: this.productCreated.id };
    data.description[this.language] = this.description;
    this.productService.editProduct(data).subscribe(
      (data) => {
        // this.showSnackbar.showSucces(this.translate.instant('Product has been edited successfully'), 6000);
        this.productCreated = data.data;
        this.stepIndex += 1;
        this.stateProduct.setProducCreated(data.data);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      },
    );
  }

  onSaveBasicProduct(): void {
    if (true) {
      let data = this.processingData();
      if (this.productCreated) {
        data = this.parseLanguajeEdit(data, this.productCreated, this.language);
        data.id = this.productCreated.id;
        this.productService.editProduct(data).subscribe(
          (data) => {
            this.showSnackbar.showSucces(this.translate.instant('Product has been edited successfully'), 6000);
            this.productCreated = data.data;
            this.stepIndex += 1;
            this.stateProduct.setProducCreated(data.data);
            this.firstStateChanged = false;
          },
          (error) => {},
        );
      } else {
        data = this.parseLanguaje(data, this.language);
        console.log('CreateProductComponent -> onSaveBasicProduct -> data', data);
        this.productService.createProduct(data).subscribe(
          (data) => {
            // this.showSnackbar.showSucces(this.translate.instant('Product has been successfully created'), 6000);
            this.productCreated = data.data;
            this.assignDescription();
            console.log('CreateProductComponent -> onSaveBasicProduct ->  this.stepIndex', this.stepIndex);
            this.stepIndex += 1;
            console.log('CreateProductComponent -> onSaveBasicProduct ->  this.stepIndex', this.stepIndex);
            this.stateProduct.setProducCreated(data.data);
            this.firstStateChanged = false;
            this.spinner.hide();
          },
          (error) => {
            this.utilsService.errorHandle(error);
            this.spinner.hide();
          },
        );
      }
    } else {
      this.stepIndex += 1;
    }
  }

  validatorStepOne(): boolean {
    if (this.typeProduct == 'physical') {
      return this.BasicInfo.valid && this.physicalProductForm && this.physicalProductForm.valid;
    } else if (this.typeProduct == 'digital') {
      return this.BasicInfo.valid && this.digitallProductForm && this.digitallProductForm.valid;
    } else {
      return this.BasicInfo.valid && this.serviceProductForm && this.serviceProductForm.valid;
    }
  }
  validarDescripcion(): boolean {
    return this.description != undefined && this.description.length;
  }

  onDescriptionChange(event) {
    this.descriptionForm.setValue(event);
  }

  assignDescription() {
    if (this.typeProduct == 'physical') {
      this.description = this.examplePhysicalDescription;
    } else if (this.typeProduct == 'digital') {
      this.description = this.exampleDigitalDescription;
    } else {
      this.description = this.exampleServiceDescription;
    }
    this.descriptionForm.setValue(this.description);
  }

  processingData() {
    let data = {
      ...this.BasicInfo.value,
      Digital: this.digitallProductForm && this.typeProduct == 'digital' ? this.digitallProductForm.value : undefined,
      Physical: this.physicalProductForm && this.typeProduct == 'physical' ? this.physicalProductForm.value : undefined,
      Service: this.serviceProductForm && this.typeProduct == 'service' ? this.serviceProductForm.value : undefined,
    };

    return data;
  }

  onSlectionChange(event): void {
    this.stepIndex = event.selectedIndex;
    if (this.stepIndex) {
    }
  }

  parseLanguaje(data, lang) {
    data.name = { [lang]: data.name };
    if (data.description) {
      data.description = { [lang]: data.description };
    }

    data.shortDescription = { [lang]: data.shortDescription };
    return data;
  }

  parseLanguajeEdit(data, olData, lang) {
    olData.name[lang] = data.name;
    olData.shortDescription[lang] = data.shortDescription;
    data.name = olData.name;
    data.shortDescription = olData.shortDescription;
    return data;
  }

  //////////////////FUNCTIONS RECOMENDED PRODUCTS///////////////////

  onRecomendedProductChange(event) {
    this.recomendedProductsOutput = event;
  }

  onSetRecomended(): void {
    const data = this.recomendedProductsOutput.map((item) => item.id);
    this.productService.createRecomendedProduct(this.productCreated.id, { ids: data }).subscribe(
      (newRecomended) => {
        this.showSnackbar.showSucces(this.translate.instant('The recomended products has been changed successfully'));
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  //////////////////////////////////////////////////////////////////////////

  ///////////////////FUNCTION TO TAGS//////////////////////

  onChangeTags(event) {
    if (this.productCreated) {
      this.productCreated.tags = event;
      this.stateProduct.setProducCreated(this.productCreated);
    }
  }

  ///////////////////////////////////////////////////////

  onSaveProduct(): void {
    this.productService.editProduct({ status: 'published', id: this.productCreated.id }).subscribe(
      () => {
        this.productService.productPromotion(this.productCreated).subscribe(() => {
          console.log('Producto promosionado correctamente');
        });
        this.showSnackbar.showSucces(this.translate.instant('You have published your product successfully'));
        this.onClearStorage();
        this.stepper.reset();
        this.Location.back();
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  getProgress() {
    let progress = 0;
    if (this.BasicInfo) {
      if (this.BasicInfo.valid) {
        progress += 25;
      }
      if (this.BasicInfo.valid && this.imagesDataProduct.length) {
        progress += 25;
      }
      if (this.BasicInfo.valid && this.imagesDataProduct.length && this.recomendedProducts) {
        progress += 25;
      }
      if (this.stepIndex === 3) {
        progress += 25;
      }
    }

    return progress;
  }

  /////////////////////UTILS/////////////////////////////////////

  getArrayPrices(): any {
    let arrayPrices: FormArray = this.BasicInfo.get('PriceRange') as FormArray;
    return arrayPrices.controls;
  }

  addPriceRange(data?) {
    let arrayPrices: FormArray = this.BasicInfo.get('PriceRange') as FormArray;
    let minSale = this.BasicInfo.get('minSale').value;
    let maxSale = this.BasicInfo.get('maxSale').value;
    let lastIndex = arrayPrices.controls.length - 1;
    let lastForm: any = lastIndex > -1 ? arrayPrices.controls[lastIndex].value : undefined;
    let boundaryMinSale = lastForm && lastForm.max ? lastForm.max + 1 : minSale;
    let boundaryMaxSale = maxSale;
    let price = lastIndex > -1 ? lastForm.price : 1;
    if (boundaryMinSale <= boundaryMaxSale) {
      if (data) {
        arrayPrices.push(
          this.fb.group({
            min: [data.min, [Validators.required, Validators.min(minSale), Validators.max(maxSale)]],
            max: [data.max, [Validators.required, Validators.min(boundaryMinSale), Validators.max(maxSale)]],
            price: [data.price, [Validators.required, Validators.min(0.001)]],
          }),
        );
      } else {
        arrayPrices.push(
          this.fb.group({
            min: [boundaryMinSale, [Validators.required, Validators.min(minSale), Validators.max(maxSale)]],
            max: [boundaryMaxSale, [Validators.required, Validators.min(boundaryMinSale), Validators.max(maxSale)]],
            price: [price, [Validators.required, Validators.min(0.001)]],
          }),
        );
      }
    }
  }

  onUploadPreviewData() {
    let dialogRef: MatDialogRef<DialogUploadMediaComponent, any>;
    dialogRef = this.dialog.open(DialogUploadMediaComponent, {
      panelClass: 'app-dialog-upload-media',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('******************-------------------------------', result);
        console.log('***********************************', result.url);
        this.digitallProductForm.get('previewUrl').setValue(result.url);
      }
    });
  }

  onUploadContentData() {
    let dialogRef: MatDialogRef<DialogUploadMediaComponent, any>;
    dialogRef = this.dialog.open(DialogUploadMediaComponent, {
      panelClass: 'app-dialog-upload-media',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('******************-------------------------------', result);
        console.log('***********************************', result.url);
        this.digitallProductForm.get('referenceUrl').setValue(result.url);
      }
    });
  }

  onRemoveRangePrice(index) {
    let arrayPrices: FormArray = this.BasicInfo.get('PriceRange') as FormArray;
    arrayPrices.removeAt(index);
  }

  //////////////////////////VARIABLES///////////////////////////////////
  examplePhysicalDescription = `<p><strong><span style="font-size:16px">Las caracteristicas fundamentales del producto son:</span></strong></p>

  <ul style="margin-left:40px">
    <li><span style="font-size:16px">Tama&ntilde;o es: <strong>20cmx13cmx14cm.</strong></span></li>
    <li><span style="font-size:16px">Posee una velocidad de escritura superior a los: <strong>20mb/s.</strong></span></li>
    <li><span style="font-size:16px">Aplica ganma de olores entre todos los dem&aacute;s.</span></li>
    <li>L<span style="font-size:16px">Lorem&nbsp;ipsum&nbsp;dolor&nbsp;sit&nbsp;amet&nbsp;consectetur&nbsp;adipisicing&nbsp;elit.&nbsp;Perspiciatis&nbsp;autem&nbsp;saepe&nbsp;similique&nbsp;ipsa&nbsp;earum&nbsp;perferendis&nbsp;deserunt&nbsp;dignissimos aspernatur,&nbsp;sequi&nbsp;veritatis&nbsp;consectetur,&nbsp;distinctio&nbsp;ab&nbsp;laboriosam&nbsp;a&nbsp;ex&nbsp;iste&nbsp;repudiandae,&nbsp;quis&nbsp;nihil.</span></li>
    <li><span style="font-size:16px">El peso m&aacute;ximo es 20kg.</span></li>
  </ul>

  <p>&nbsp;</p>

  <p>&nbsp;</p>`;

  exampleDigitalDescription = `<p><span style="font-size:16px"><strong>Que estamos vendiendo</strong></span></p>

  <ul>
    <li>Serverless Framework es un marco web gratuito y de c&oacute;digo abierto escrito con Node.js. Sin servidor es el primer marco que se desarroll&oacute; originalmente para crear aplicaciones exclusivamente en AWS Lambda, una plataforma inform&aacute;tica sin servidor proporcionada por Amazon como parte de los Servicios Web de Amazon. Actualmente, las aplicaciones desarrolladas con Serverless se pueden implementar en otras funciones como proveedores de servicios, incluidos Microsoft Azure con Azure Functions, IBM Bluemix con IBM Cloud Functions basado en Apache OpenWhisk, Google Cloud con Google Cloud Functions, Oracle Cloud con Oracle Fn [1] , Kubeless basado en Kubernetes, Spotinst y Webtask de Auth0. [2]</li>
  </ul>

  <p>&nbsp;</p>

  <p><span style="font-size:16px"><strong>Requerimientos:</strong></span></p>

  <ul>
    <li style="margin-left: 40px;">Knowledge of Nodejs is required</li>
    <li style="margin-left: 40px;">Basic understanding of the AWS Cloud is preferred to take this course</li>
    <li>&nbsp;</li>
  </ul>

  <div><strong>Descripci&oacute;n</strong></div>

  <p><strong>Serverless</strong> is a cloud computing execution model where the cloud provider dynamically manages the allocation and provisioning of servers. A serverless application runs in stateless compute containers that are event-triggered, ephemeral (may last for one invocation), and fully managed by the cloud provider. Pricing is based on the number of executions rather than pre-purchased compute capacity, isn&rsquo;t it the ideal framework for that project you have been planning since a long time? Well, go ahead do it.</p>

  <p>Most of the cloud providers have invested heavily in serverless and thats a lot of money; with the given massive promotion and realistic offering you can safely assume serverless to be one of the most used cloud services in upcoming years. Here are some of the currently available cloud services:</p>

  <ul style="margin-left:40px">
    <li>
    <p>AWS Lambda</p>
    </li>
    <li>
    <p>Google Cloud Functions</p>
    </li>
    <li>
    <p>Azure Functions</p>
    </li>
    <li>
    <p>IBM OpenWhisk</p>
    </li>
    <li>
    <p>Alibaba Function Compute</p>
    </li>
    <li>
    <p>Iron Functions</p>
    </li>
    <li>
    <p>Auth0 Webtask</p>
    </li>
    <li>
    <p>Oracle Fn Project</p>
    </li>
    <li>
    <p>Kubeless</p>
    </li>
  </ul>

  <p>&nbsp;</p>

  <p>&nbsp;</p>

  <p><span style="font-size:16px"><strong>Pricing</strong></span></p>

  <p>One of the major advantages of using Serverless is reduced cost, for years the cost of provisioning servers and maintaining that 24x7 server team which blew a hole in your pocket is gone. The cost model of Serverless is execution-based: you&rsquo;re charged for the number of executions. You&rsquo;re allotted a certain number of seconds of use that varies with the amount of memory you require. Likewise, the price per MS (millisecond) varies with the amount of memory you require. Obviously, shorter running functions are more adaptable to this model with a peak execution time of 300-second for most Cloud vendors.</p>

  <p>The winner here is Serverless Architecture.</p>

  <p>&nbsp;</p>
  `;

  exampleServiceDescription = `<p>&nbsp;</p>

  <div><span style="font-size:16px"><strong>Descripcion</strong></span></div>

  <div><span style="font-size:16px">Serverless&nbsp;Framework&nbsp;es&nbsp;un&nbsp;marco&nbsp;web&nbsp;gratuito&nbsp;y&nbsp;de&nbsp;c&oacute;digo&nbsp;abierto&nbsp;escrito&nbsp;con&nbsp;Node.js.&nbsp;Serverless&nbsp;es&nbsp;el&nbsp;primer&nbsp;marco&nbsp;desarrollado&nbsp;originalmente&nbsp;para&nbsp;crear&nbsp;aplicaciones&nbsp;exclusivamente&nbsp;en&nbsp;AWS&nbsp;Lambda,&nbsp;una&nbsp;plataforma&nbsp;inform&aacute;tica&nbsp;sin&nbsp;servidor&nbsp;proporcionada&nbsp;por&nbsp;Amazon&nbsp;como&nbsp;parte&nbsp;de&nbsp;los&nbsp;servicios&nbsp;webde&nbsp;Amazon.&nbsp;Actualmente,&nbsp;las&nbsp;aplicaciones&nbsp;desarrolladas&nbsp;con&nbsp;Serverless&nbsp;pueden&nbsp;implementarse&nbsp;en&nbsp;otras&nbsp;funciones&nbsp;como&nbsp;proveedores&nbsp;de&nbsp;servicios,&nbsp;incluidos&nbsp;Microsoft&nbsp;Azure&nbsp;con&nbsp;Azure&nbsp;Functions,&nbsp;IBM&nbsp;Bluemix&nbsp;con&nbsp;Apache&nbsp;OpenWhisk&nbsp;basado&nbsp;en&nbsp;IBM&nbsp;Cloud&nbsp;Functions,&nbsp;Google&nbsp;Cloud&nbsp;con&nbsp;Google&nbsp;Cloud&nbsp;Functions,&nbsp;Oracle&nbsp;Cloud&nbsp;con&nbsp;Oracle&nbsp;Fn&nbsp;[1],&nbsp;Kubeless&nbsp;basado&nbsp;en&nbsp;Kubernetes,&nbsp;Spotinst&nbsp;y&nbsp;Webtask&nbsp;de&nbsp;Auth0.&nbsp;[2]</span></div>

  <div>&nbsp;</div>

  <div><span style="font-size:16px"><span style="font-size:16px"><strong>Que&nbsp;&nbsp;vendemos&nbsp;en&nbsp;este&nbsp;servicio</strong></span></span>&nbsp;</div>

  <div>
  <p><span style="font-size:16px"><span style="font-size:16px">Desarrolle&nbsp;e&nbsp;implemente&nbsp;las&nbsp;funciones&nbsp;de&nbsp;AWS&nbsp;Lambda&nbsp;correcta</span></span></p>

  <p><span style="font-size:16px"><span style="font-size:16px">Aprenda&nbsp;los&nbsp;fundamentos&nbsp;de&nbsp;AWS&nbsp;Lambda.</span></span></p>
  </div>

  <p><strong><span style="font-size:16px">Requirements</span></strong></p>

  <p><span style="font-size:16px"><span style="font-size:16px">Deploy&nbsp;Serverless&nbsp;APIs&nbsp;to&nbsp;AWS&nbsp;Provider.&nbsp;</span></span></p>

  <p>Se&nbsp;prefiere&nbsp;la&nbsp;comprensi&oacute;n&nbsp;b&aacute;sica&nbsp;de&nbsp;la&nbsp;nube&nbsp;de&nbsp;AWS&nbsp;para&nbsp;tomar&nbsp;este&nbsp;curso.<span style="font-size:16px"><span style="font-size:16px"><span style="font-size:16px">Se&nbsp;requiere&nbsp;conocimiento&nbsp;de&nbsp;Nodejs.</span></span></span></p>
  `;

  //////////////////////////////////////////////////////////////
}
