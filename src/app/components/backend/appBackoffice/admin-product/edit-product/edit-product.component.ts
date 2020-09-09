import { CurrencyService } from './../../../../../core/services/currency/currency.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { ProductService } from '../../../../shared/services/product.service';
import { CategoriesService } from '../../../services/categories/catagories.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IUser } from './../../../../../core/classes/user.class';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { environment } from './../../../../../../environments/environment';
import { takeUntil, map } from 'rxjs/operators';
import { TaxesShippingService } from '../../../services/taxes-shipping/taxes-shipping.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { DialogAddEditTaxesComponent } from '../../../common-dialogs-module/dialog-add-edit-taxes/dialog-add-edit-taxes.component';
import { DialogUploadMediaComponent } from '../dialog-upload-media/dialog-upload-media.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProductComponent implements OnInit, OnDestroy {
  Brands: any[] = [];
  Categories: any[] = [];
  imageUrl = null;
  loggedInUser: IUser = null;
  language = null;
  _unsubscribeAll: Subject<any>;
  languages: any[] = [];
  languageForm: FormControl;
  BasicInfo: FormGroup;
  physicalProductForm: FormGroup;
  digitallProductForm: FormGroup;
  serviceProductForm: FormGroup;
  firstStateChanged = false;
  selectedProduct: any = null;
  recomendedProducts: any[] = [];
  tags: any[] = [];
  imagesProduct: any[] = [];
  typeProduct = undefined;
  editorValue = null;
  description = null;
  shippings: any[] = [];
  taxes: any[] = [];
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

  ////////////////////////////////////////////
  name = 'ng2-ckeditor';
  ckeConfig: any;
  text: string;
  log: string = '';
  @ViewChild('myckeditor', { static: true }) ckeditor: any;
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private loggedInUserService: LoggedInUserService,
    private showSnackbar: ShowSnackbarService,
    private fb: FormBuilder,
    public currencyService: CurrencyService,
    public dialog: MatDialog,
    private taxesShippingService: TaxesShippingService,
    private translate: TranslateService,
    private showToast: ShowToastrService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.languages = this.loggedInUserService.getlaguages();
    this.imageUrl = environment.imageUrl;
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // -------------------------------------------------

    if (!this.uploadDigitalProduct) {
      this.typesProducts = [
        { id: 'physical', name: { es: 'Físico', en: 'Physical' } },
        { id: 'service', name: { es: 'Servicio', en: 'Service' } },
      ];
    }
    if (!this.uploadServicesProduct) {
      this.typesProducts = [{ id: 'physical', name: { es: 'Físico', en: 'Physical' } }];
    }

    this.activatedRoute.data
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((item) => item.product.data),
      )
      .subscribe((data) => {
        this.selectedProduct = data;
        this.imagesProduct = this.selectedProduct.Image;
        this.tags = this.selectedProduct.tags;
        this.productService.getRecomendedProduct(this.selectedProduct.id).subscribe(
          (recProducts) => {
            this.recomendedProducts = recProducts.data;
          },
          (error) => {
            this.utilsService.errorHandle(error);
          },
        );
      });
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Products', false, '/backend/product/list');
    this.breadcrumbService.setBreadcrumd('Editar', false, null);
    this.breadcrumbService.setBreadcrumd(`${this.selectedProduct.id}`, true, null);

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

    // this.taxesShippingService
    //   .getAllShippings({ limit: 0, offset: 0 }, { ProductId: this.selectedProduct.id })
    //   .subscribe(
    //     (shppings) => {
    //       this.shippings = shppings.data;
    //     },
    //     (error) => {
    //       this.utilsService.errorHandle(error);
    //     },
    //   );

    // this.taxesShippingService.getAllTaxes({ limit: 0, offset: 0 }, { ProductId: this.selectedProduct.id }).subscribe(
    //   (taxes) => {
    //     this.taxes = taxes.data;
    //     // console.log('TCL: EditProductComponent -> ngOnInit -> this.taxes', this.taxes);
    //   },
    //   (error) => {
    //     this.utilsService.errorHandle(error);
    //   },
    // );

    /////////Subscriptions to change data//////////

    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });

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
      height: '35rem',
    };
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  buildForm(): void {
    this.BasicInfo = this.fb.group({
      type: [
        { value: this.selectedProduct ? this.selectedProduct.type : null, disabled: this.selectedProduct != undefined },
        [Validators.required],
      ],
      name: [
        this.selectedProduct ? this.selectedProduct.name[this.language] : null,
        [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required],
      ],
      shortDescription: [
        this.selectedProduct ? this.selectedProduct.shortDescription[this.language] : null,
        [
          Validators.minLength(10),
          Validators.pattern(/^\w((?!\s{2}).)*/),
          Validators.maxLength(250),
          Validators.required,
        ],
      ],
      CategoryId: [this.selectedProduct ? this.selectedProduct.CategoryId : null, Validators.required],
      rating: [this.selectedProduct ? this.selectedProduct.rating : null, []],
      minSale: [
        this.selectedProduct && this.selectedProduct.minSale ? this.selectedProduct.minSale : 1,
        [Validators.required, Validators.min(1)],
      ],
      maxSale: [
        this.selectedProduct && this.selectedProduct.maxSale ? this.selectedProduct.maxSale : 100,
        [Validators.required, Validators.max(10000)],
      ],
      PriceRange: new FormArray([]),
    });

    if (this.selectedProduct) {
      this.productService.getRecomendedProduct(this.selectedProduct.id).subscribe((data: any) => {
        this.recomendedProducts = data.data;
      });
      this.tags = this.selectedProduct.tags;
      this.typeProduct = this.selectedProduct.type;
      if (this.selectedProduct.description) {
        this.description = this.selectedProduct.description[this.language]
          ? this.selectedProduct.description[this.language]
          : this.selectedProduct.description['es'];
      } else {
        this.assignDescription();
      }

      for (let data of this.selectedProduct.PriceRanges) {
        this.addPriceRange(data);
      }
      if (!this.selectedProduct.PriceRanges || !this.selectedProduct.PriceRanges.length) {
        this.addPriceRange();
      }
      this.buildTypeProductFrom(this.typeProduct);
    }
  }

  onTypesProductosChange(event) {
    this.typeProduct = event.value;
    this.buildTypeProductFrom(this.typeProduct);
  }

  buildTypeProductFrom(type) {
    console.log('CreateProductComponent -> buildTypeProductFrom -> type', type);
    if (type == 'physical') {
      console.log('Entre aqui');
      this.physicalProductForm = this.fb.group({
        BrandId: [this.selectedProduct && this.selectedProduct.Physical ? this.selectedProduct.Physical.BrandId : null],
        stock: [
          this.selectedProduct && this.selectedProduct.Physical ? this.selectedProduct.Physical.stock : 0,
          [Validators.required, Validators.min(0), Validators.max(10000)],
        ],
        height: [this.selectedProduct ? this.selectedProduct.height : 0, []],
        width: [this.selectedProduct ? this.selectedProduct.width : 0, []],
        length: [this.selectedProduct ? this.selectedProduct.length : 0, []],
        weigth: [this.selectedProduct ? this.selectedProduct.weigth : 0, []],
        stockThreshold: [
          this.selectedProduct && this.selectedProduct.Physical ? this.selectedProduct.Physical.stockThreshold : 0,
          [Validators.required, Validators.min(0), Validators.max(50)],
        ],
        showStockQuantity: [
          this.selectedProduct && this.selectedProduct.Physical
            ? this.selectedProduct.Physical.showStockQuantity
            : false,
          [],
        ],
      });

      // console.log('CreateProductComponent -> buildTypeProductFrom -> this.selectedProduct', this.selectedProduct);
      // console.log(' this.physicalProductForm', this.physicalProductForm);
    } else if (type == 'digital') {
      this.digitallProductForm = this.fb.group({
        previewUrl: [
          this.selectedProduct && this.selectedProduct.Digital ? this.selectedProduct.Digital.previewUrl : null,
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
          ),
        ],
        formatTypePreviewUrl: [
          this.selectedProduct && this.selectedProduct.Digital
            ? this.selectedProduct.Digital.formatTypePreviewUrl
            : null,
          [Validators.required],
        ],
        referenceUrl: [
          this.selectedProduct && this.selectedProduct.Digital ? this.selectedProduct.Digital.referenceUrl : null,
          Validators.pattern(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
          ),
        ],
        formatTypereferenceUrl: [
          this.selectedProduct && this.selectedProduct.Digital
            ? this.selectedProduct.Digital.formatTypereferenceUrl
            : null,
          [Validators.required],
        ],
      });
    } else {
      this.serviceProductForm = this.fb.group({
        contactInfo: new FormArray([]),
      });
      if (this.selectedProduct && this.selectedProduct.Service) {
        this.selectedProduct.Service.contactInfo.map((item) => {
          this.addNewContactForService(
            this.fb.group({
              type: [item.type, [Validators.required]],
              contact: [
                item.contact,
                [
                  Validators.required,
                  item.type == 'email' ? Validators.email : Validators.pattern(/(^\+\d+$)|(^\d+$)/),
                ],
              ],
            }),
          );
        });
      } else {
        this.addNewContactForService();
      }
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

  validatorStepOne(): boolean {
    if (this.typeProduct == 'physical') {
      return this.BasicInfo.valid && this.physicalProductForm && this.physicalProductForm.valid;
    } else if (this.typeProduct == 'digital') {
      return this.BasicInfo.valid && this.digitallProductForm && this.digitallProductForm.valid;
    } else {
      return this.BasicInfo.valid && this.serviceProductForm && this.serviceProductForm.valid;
    }
  }

  assignDescription() {
    if (this.typeProduct == 'physical') {
      this.description = this.examplePhysicalDescription;
    } else if (this.typeProduct == 'digital') {
      this.description = this.exampleDigitalDescription;
    } else {
      this.description = this.exampleServiceDescription;
    }
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

  onAsignDescription() {
    this.spinner.show();
    let data = { description: {}, id: this.selectedProduct.id };
    data.description[this.language] = this.description;
    this.productService.editProduct(data).subscribe(
      (data) => {
        // this.showSnackbar.showSucces(this.translate.instant('Product has been edited successfully'), 6000);
        this.showSnackbar.showSucces('Descripción del producto actualizada con éxito', 8000);
        this.selectedProduct = data.data;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      },
    );
  }

  onSaveBasicProduct() {
    let data = this.processingData();
    this.spinner.show();
    data = this.parseLanguajeEdit(data, this.selectedProduct, this.language);
    data.id = this.selectedProduct.id;
    this.productService.editProduct(data).subscribe(
      (data) => {
        this.showSnackbar.showSucces('Parámetros básicos del producto actualizado', 8000);
        this.selectedProduct = data.data;
        this.spinner.hide();
      },
      (error) => {
        this.utilsService.errorHandle(error);
        this.spinner.hide();
      },
    );
  }

  async onDeleteTax(tax) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar el Tax?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(tax.map((item) => this.taxesShippingService.removeTax(item)));
          this.showToast.showSucces(this.translate.instant('Taxes successfully removed'), 'Succes', 7500);
          this.taxesShippingService
            .getAllTaxes({ limit: 0, offset: 0 }, { ProductId: this.selectedProduct.id })
            .subscribe(
              (taxes) => {
                this.taxes = taxes.data;
              },
              (error) => {
                this.utilsService.errorHandle(error);
              },
            );
        }
      } catch (error) {
        this.utilsService.errorHandle(error);
      }
    });
  }

  onEditTax(tax) {
    let dialogRef: MatDialogRef<DialogAddEditTaxesComponent, any>;
    this.taxesShippingService.getTax(tax).subscribe((data) => {
      dialogRef = this.dialog.open(DialogAddEditTaxesComponent, {
        panelClass: 'app-dialog-add-edit-taxes',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          isEditing: true,
          selectedTax: data.data,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.taxesShippingService
          .getAllTaxes({ limit: 0, offset: 0 }, { ProductId: this.selectedProduct.id })
          .subscribe(
            (taxes) => {
              this.taxes = taxes.data;
            },
            (error) => {
              this.utilsService.errorHandle(error);
            },
          );
      });
    });
  }

  // --------------------UTILS FOR LANGUAGE-----------------------
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  parseLanguaje(data, lang) {
    data.name = { [lang]: data.name };
    data.description = { [lang]: data.description };
    return data;
  }

  parseLanguajeEdit(data, oldData, lang) {
    oldData.name[lang] = data.name;
    oldData.shortDescription[lang] = data.shortDescription;
    data.name = oldData.name;
    data.shortDescription = oldData.shortDescription;
    return data;
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

  onRemoveRangePrice(index) {
    let arrayPrices: FormArray = this.BasicInfo.get('PriceRange') as FormArray;
    arrayPrices.removeAt(index);
  }

  onSaveRecomendedTags() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 250);
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
  // -------------------------------------------------------------
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

  //////////////////////////////////////////////////////////////
}
