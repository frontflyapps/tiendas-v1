import { TaxesShippingService } from './../../backend/services/taxes-shipping/taxes-shipping.service';
import { DialogNoCartSelectedComponent } from './../no-cart-selected/no-cart-selected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { PayService } from './../../../core/services/pay/pay.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CartItem, Cart } from './../../../modals/cart-item';
import { environment } from './../../../../environments/environment';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CurrencyService } from './../../../core/services/currency/currency.service';
import { IPagination } from './../../../core/classes/pagination.class';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { RegionsService } from '../../backend/services/regions/regions.service';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { DialogEnzonaConfirmToPayComponent } from '../dialog-enzona-confirm-to-pay/dialog-enzona-confirm-to-pay.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public cartItems: Observable<CartItem[]> = of([]);
  public buyProducts: CartItem[] = [];
  public cart: Cart;
  public cartId = undefined;
  public cartItemIds: any[] = undefined;

  selectedCities: any[] = [];
  filteredCities: any[] = [];
  loadingPayment = false;
  launchTM = undefined;

  amount: number;
  payments: any[] = [
    { id: 'transfermovil', name: 'Transfermovil', logo: 'assets/images/transfermovil_logo.png' },
    { id: 'enzona', name: 'Enzona', logo: 'assets/images/enzona.jpeg' },
    { id: 'baiondo', name: 'Baiondo', logo: 'assets/images/noImage.jpg' },
  ];

  nationalitiy: any[] = [
    {
      id: true,
      name: 'Sí',
    },
    { id: false, name: 'No' },
  ];

  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;
  loggedInUser: any = null;
  form: FormGroup;
  selectedDataPay: any = null;
  loadingCart = true;

  queryCountries: IPagination = {
    limit: 1000,
    total: 0,
    offset: 0,
    order: 'name',
    page: 1,
    filter: { filterText: '', properties: [] },
  };

  allCountries: any[] = [];
  allProvinces: any[] = [];
  allMunicipalities: any[] = [];
  municipalities: any[] = [];
  qrTransfermovilImage = undefined;
  showTransfermovilImage = undefined;
  onlyCubanPeople = true;
  finalPrice = 1080;
  shippingData: any[] = [];
  canBeDelivery = true;

  public compareById(val1, val2) {
    return val1 && val2 && val1 == val2;
  }

  public displayCity(city?: any): any {
    return city && city.name ? city.name : undefined;
  }

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    public currencyService: CurrencyService,
    private fb: FormBuilder,
    private regionService: RegionsService,
    public utilsService: UtilsService,
    private payService: PayService,
    public domSanitizer: DomSanitizer,
    public loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService,
    private dialog: MatDialog,
    private socketIoService: SocketIoService,
    private activateRoute: ActivatedRoute,
    private shppingService: TaxesShippingService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.activateRoute.queryParams.subscribe((data) => {
      this.cartId = data.cartId;
      this.cartItemIds = data.cartIds;
      this.cartItemIds =
        this.cartItemIds && this.cartItemIds.constructor != Array ? [this.cartItemIds] : this.cartItemIds;
      this.processToCart();
      this.buildForm();
    });
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
        this._listenToSocketIO();
      }
    });
    this.fetchData();
    //////////////// Subscripciones para el update del carrito /////////////////
    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.processToCart();
    });

    if (this.loggedInUser) {
      this._listenToSocketIO();
    }

    this.form.valueChanges.subscribe((data) => {
      this.onRecalculateShipping();
      // console.log(this.form);
    });
  }

  processToCart() {
    if (!this.cartId) {
      let dialogRef: MatDialogRef<DialogNoCartSelectedComponent, any>;
      dialogRef = this.dialog.open(DialogNoCartSelectedComponent, {
        width: '15cm',
        maxWidth: '100vw',
        data: {},
      });

      dialogRef.afterClosed().subscribe((result) => {});
    } else {
      this.getCartData();
    }
  }

  public getCartData() {
    this.loadingCart = true;
    this.cartService
      .getCartData({ cartId: this.cartId, cartItemIds: this.cartItemIds })
      .then((data) => {
        console.log('CheckoutComponent -> getCartData -> data', data);
        this.cart = data.Cart;
        this.buyProducts = data.CartItems || [];
        this.onRecalculateShipping();
        setTimeout(() => {
          this.loadingCart = false;
        }, 250);
      })
      .catch(() => {
        this.loadingCart = false;
      });
  }

  public getTotalWithShippingIncluded(): any {
    let total = this.getTotalAmout() as Number;
    let ShippingId = this.form.get('ShippingId').value;
    let shipping = this.shippingData?.find((i) => i.id == ShippingId);
    return total + (shipping?.totalPrice || 0.0);
  }

  public getTotalAmout(): any {
    return this.buyProducts.reduce((prev, curr: CartItem) => {
      return prev + this.getTotalPricePerItem(curr);
    }, 0);
  }

  onSubmit(): void {}

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public removeItem(item: CartItem) {
    this.loadingCart = true;
    this.loggedInUserService._setDataToStorage('payData', JSON.stringify(this.form.value));
    this.cartService.removeFromCart(item);
    setTimeout(() => {
      this.loadingCart = false;
    }, 150);
  }

  buildForm() {
    // console.log('CheckoutComponent -> buildForm -> this.loggedInUser', this.loggedInUser);
    this.selectedDataPay = this.loggedInUserService._getDataFromStorage('payData');
    this.form = this.fb.group({
      name: [this.selectedDataPay ? this.selectedDataPay.name : this.loggedInUser?.name, [Validators.required]],
      lastName: [
        this.selectedDataPay ? this.selectedDataPay.lastName : this.loggedInUser?.lastName,
        [Validators.required],
      ],
      address: [this._getAddress(this.loggedInUser, this.selectedDataPay), [Validators.required]],
      address2: [this.selectedDataPay ? this.selectedDataPay.address2 : null, []],
      city: [this._getCity(this.loggedInUser, this.selectedDataPay), [Validators.required]],
      regionProvinceState: [this._getRegion(this.loggedInUser, this.selectedDataPay), [Validators.required]],
      CountryId: [this._getCountry(this.loggedInUser, this.selectedDataPay), [Validators.required]],
      ProvinceId: [this._getProvince(this.loggedInUser, this.selectedDataPay), [Validators.required]],
      MunicipalityId: [this._getMunicipality(this.loggedInUser, this.selectedDataPay), [Validators.required]],
      isForCuban: [this.selectedDataPay ? this.selectedDataPay.isForCuban : true, [Validators.required]],
      zipCode: [
        this.selectedDataPay && this.selectedDataPay.zipCode ? this.selectedDataPay.zipCode : null,
        Validators.required,
      ],
      email: [this._getEmail(this.loggedInUser, this.selectedDataPay), [Validators.required, Validators.email]],
      phone: [this._getPhone(this.loggedInUser, this.selectedDataPay), []],
      info: [this.selectedDataPay && this.selectedDataPay.info ? this.selectedDataPay.info : null, []],
      paymentType: [this.selectedDataPay ? this.selectedDataPay.paymentType : 'transfermovil', [Validators.required]],
      ShippingId: [null, [Validators.required]],
    });
    this.onlyCubanPeople = this.form.get('isForCuban').value;
    if (this.onlyCubanPeople) {
      this.form
        .get('phone')
        .setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\d+$/),
        ]);
    }
    this.updateValidatorsForChangeNationality(this.onlyCubanPeople);
  }

  onSelectProvince(provinceId) {
    // console.log('CheckoutComponent -> onSelectProvince -> provinceId', provinceId);
    // console.log('CheckoutComponent -> onSelectProvince -> this.allMunicipalities', this.allMunicipalities);
    this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    this.form.get('MunicipalityId').setValue(null);
  }

  onRecalculateShipping() {
    let data = {
      CountryId: this.form?.get('CountryId').value,
      MunicipalityId: this.form?.get('MunicipalityId').value,
      ProvinceId: this.form?.get('ProvinceId').value,
      ProductIds: this.buyProducts?.map((i) => i.ProductId),
    };
    if (data.CountryId && data.MunicipalityId && data.ProvinceId) {
      this.shppingService.getShippinginCheckout(data).subscribe((data) => {
        this.shippingData = data.shippings;
        this.canBeDelivery = data.canBeDelivery;
      });
    }
  }

  onSelectNationality(data) {
    if (data == true) {
      /*Para cubanos la cosa tranfermovil*/
      this.onlyCubanPeople = true;
      this.form.get('CountryId').setValue(59);
      this.form.get('zipCode').setValue(10400);
      this.form
        .get('phone')
        .setValidators([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\d+$/),
        ]);
      this.form.get('phone').updateValueAndValidity();
      this.form.get('paymentType').setValue('transfermovil');
    } else {
      /*Para extrangeros la cosa*/
      this.onlyCubanPeople = false;
      this.form.get('paymentType').setValue('baiondo');
      this.form.get('phone').setValidators([]);
      this.form.get('phone').updateValueAndValidity();
    }
    this.updateValidatorsForChangeNationality(data);
  }

  updateValidatorsForChangeNationality(isForCuban) {
    if (isForCuban) {
      this.form.get('city').disable();
      this.form.get('regionProvinceState').disable();
      this.form.get('ProvinceId').enable();
      this.form.get('MunicipalityId').enable();
    } else {
      this.form.get('city').enable();
      this.form.get('regionProvinceState').enable();
      this.form.get('ProvinceId').disable();
      this.form.get('MunicipalityId').disable();
    }
    this.form.updateValueAndValidity();
  }

  ///////////////////////////////
  fetchData() {
    this.regionService.getAllCountries(this.queryCountries).subscribe(
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
    this.regionService.getProvinces().subscribe((data) => {
      this.allProvinces = data.data;
    });
    this.regionService.getMunicipalities().subscribe((data) => {
      this.allMunicipalities = data.data;
      this.municipalities = this.allMunicipalities.filter(
        (item) => item.ProvinceId == this.form.get('ProvinceId').value,
      );
    });
  }

  public getTotalPricePerItem(item: CartItem) {
    let price = this.cartService.getPriceofProduct(item.Product, item.quantity);
    return price * item.quantity;
  }

  filterCities(val) {
    val = val.trim().toLowerCase();
    return this.selectedCities.filter(function (item) {
      let nameCity = item.name.trim().toLowerCase();
      return nameCity.includes(val);
    });
  }

  ////////////////////////////////////////////////
  autocompleteValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control || !control.value || !control.value.id) {
      return { InvalidValue: true };
    }
    return null;
  }

  onPayOrder() {
    this.loadingPayment = true;
    const data = { ...this.form.value };
    data.description = data.description || `Pago realizado por el cliente ${data.name} ${data.lastName}`;
    data.urlClient = environment.url;
    this.loggedInUserService._setDataToStorage('payData', JSON.stringify(this.form.value));
    data.CartItemIds = this.buyProducts.map((item) => item.id);
    data.CartId = this.cart.id;
    if (data.paymentType == 'transfermovil') {
      return this.processTransfermovil(data);
    }
    if (data.paymentType == 'enzona') {
      return this.processEnzona(data);
    }
    if (data.paymentType == 'baiondo') {
      this.loadingPayment = false;
      return;
    }
  }

  ///////////////////////////////////////////////
  processTransfermovil(bodyData) {
    this.payService.makePaymentTransfermovil(bodyData).subscribe(
      (data: any) => {
        console.log('Entre aqui');
        if (data && data.data) {
          this.finalPrice = this.getTotalAmout() as number;
          this.qrTransfermovilImage = data.data.qr;
          this.showTransfermovilImage = true;
          this.launchTM =
            'transfermovil://tm_compra_en_linea/action?id_transaccion=' +
            data.data.qrJson.id_transaccion +
            '&importe=' +
            data.data.qrJson.importe +
            '&moneda=' +
            data.data.qrJson.moneda +
            '&numero_proveedor=' +
            data.data.qrJson.numero_proveedor +
            ' ';
        } else {
          this.showTransfermovilImage = false;
          this.loadingPayment = false;
          this.showToastr.showError('Error en la respuesta, fallo en la obtencion del qr');
        }
      },
      (error) => {
        this.loadingPayment = false;
      },
    );
  }

  processEnzona(bodyData) {
    const link: any = document.getElementById('pasarelaLink');
    this.payService.makePaymentEnzona(bodyData).subscribe(
      (data: any) => {
        // link.href = data.data.linkConfirm;
        // link.click();
        // document.location.href = data.data.linkConfirm;
        // setTimeout(() => {
        //   this.loadingPayment = false;
        // }, 10000);

        let dialogRef: MatDialogRef<DialogEnzonaConfirmToPayComponent, any>;

        dialogRef = this.dialog.open(DialogEnzonaConfirmToPayComponent, {
          width: '15cm',
          maxWidth: '100vw',
          data: {
            link: data.data.linkConfirm,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          window.location.reload();
          this.loadingPayment = false;
        });
      },
      (error) => {
        this.loadingPayment = false;
      },
    );
  }

  //////////Utiles/////////////////
  _getAddress(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.address;
    }
    if (user && user.address) {
      return user.address;
    }
    return null;
  }

  _getCity(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.city;
    }
    if (user && user.City) {
      return user.City.name;
    }
    return null;
  }

  _getCountry(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.CountryId;
    }
    if (storagePayData && storagePayData.isForCuban) {
      return 59;
    }
    if (user && user.CountryId) {
      return user.CountryId;
    }
    return 59;
  }

  _getRegion(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.regionProvinceState;
    }
    if (user && user.regionProvinceState) {
      return user.regionProvinceState;
    }
    return null;
  }

  _getPhone(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.phone;
    }
    if (user && user.phone) {
      return user.phone;
    }
    return null;
  }

  _getEmail(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.email;
    }
    if (user && user.email) {
      return user.email;
    }
    return null;
  }

  _getProvince(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.ProvinceId;
    }
    if (user && user.ProvinceId) {
      return user.ProvinceId;
    }
    return null;
  }

  _getMunicipality(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.MunicipalityId;
    }
    if (user && user.MunicipalityId) {
      return user.MunicipalityId;
    }
    return null;
  }

  // tslint:disable-next-line: member-ordering
  qrO: any = {
    qr:
      'data:image/png;base64,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',
    PaymentCode: 'exp-p-00000-00074',
    succes: true,
  };

  onCancelarTranfermovilPayment() {
    const dialogRef = this.dialog.open(ConfirmationDialogFrontComponent, {
      width: '550px',
      data: {
        title: 'Cancelar la confirmación con transfermovil',
        textHtml: `
        <h4 style="text-transform:none !important; line-height:1.6rem !important;">
          ¿ Desea cancelar la confirmación con transfermóvil ?
        </h4>
       `,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.qrTransfermovilImage = undefined;
        this.showTransfermovilImage = null;
        this.loadingPayment = false;
        window.location.reload();
      }
    });
  }

  _listenToSocketIO() {
    this.socketIoService
      .listen('payment-confirmed')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.showTransfermovilImage = false;
        this.getCartData();
      });
  }
}
