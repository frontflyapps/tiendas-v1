import { MetaService } from 'src/app/core/services/meta.service';
import { DialogNoCartSelectedComponent } from '../no-cart-selected/no-cart-selected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PayService } from '../../../core/services/pay/pay.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { CartItem, Cart, IBusiness } from '../../../modals/cart-item';
import { environment } from '../../../../environments/environment';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { debounce, debounceTime, takeUntil } from 'rxjs/operators';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { IPagination } from '../../../core/classes/pagination.class';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { DialogEnzonaConfirmToPayComponent } from '../dialog-enzona-confirm-to-pay/dialog-enzona-confirm-to-pay.component';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
import { DetailsShippingComponent } from '../details-shipping/details-shipping.component';
import { DialogTranfermovilQrComponent } from '../dialog-tranfermovil-qr/dialog-tranfermovil-qr.component';
import { RegionsService } from '../../../core/services/regions/regions.service';
import { TaxesShippingService } from '../../../core/services/taxes-shipping/taxes-shipping.service';
import { CoinEnum } from '../../../core/classes/coin.enum';
import { MarketEnum } from '../../../core/classes/market.enum';
import { MyOrdersService } from '../../my-orders/service/my-orders.service';
import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';
import { MatTableDataSource } from '@angular/material/table';
import { DialogBidaiondoConfirmToPayComponent } from '../dialog-bidaiondo-confirm-to-pay/dialog-bidaiondo-confirm-to-pay.component';
import { ConfigurationService } from '../../../core/services/configuration/configuration.service';
import { CurrencyCheckoutPipe } from 'src/app/core/pipes/currency-checkout.pipe';
import { BusinessService } from '../../../core/services/business/business.service';
import { CUBAN_PHONE_START_5 } from '../../../core/classes/regex.const';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { MyContactsComponent } from '../../main/my-contacts/my-contacts.component';

export const PASARELA_BASE = 'transfermovil';

export const amexData = {
  express: 1, // American Express
  visa: 2, // Visa
  masterCard: 3, // Master Card
  'dinners-club-internacional': 4,
  jcb: 5,
  maestro: 9,
  electron: 10,
  'tarjeta-virtual': 11,
  bizum: 12,
  iupay: 13,
  'discover-global': 14,

  // Variable amex       Tarjeta o método de pago
  // 1                   American Express
  // 2                   Visa
  // 3                   Mastercard
  // 4                   Dinners Club Internacional
  // 5                   JCB
  // 9                   Mastercard Maestro
  // 10                  Visa Electrón
  // 11                  Tarjeta Virtual
  // 12                  Bizum
  // 13                  Iupay
  // 14                  Discover Global
};

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [CurrencyCheckoutPipe],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public CI_Length = 7;

  public cartItems: Observable<CartItem[]> = of([]);
  public buyProducts: CartItem[] = [];
  public cart: Cart;
  public cartId = undefined;
  public cartItemIds: any[] = undefined;
  public theBusiness: IBusiness;

  public showInfoDataToPay = true;
  public showPayment = false;

  inLoading = false;
  selectedCities: any[] = [];
  filteredCities: any[] = [];
  loadingPayment = false;
  launchTM = undefined;
  currencies = ['USD', 'EUR'];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['product', 'quantity', 'price', 'action'];
  amount: number;
  payments: any[] = [
    { id: 'transfermovil', name: 'Transfermovil', logo: 'assets/images/cards/transfermovil_logo.png', market: 'national' },
    // { id: 'enzona', name: 'Enzona', logo: 'assets/images/cards/enzona.jpeg', market: 'national' },
    { id: 'transfermovil', name: 'Transfermovil', logo: 'assets/images/cards/transfermovil_logo.png', market: 'international' },
    // { id: 'visa', name: 'Visa', logo: 'assets/images/cards/visa_logo.png', market: 'international' },
    // { id: 'express', name: 'American Express', logo: 'assets/images/cards/american_express_logo.png', market: 'international' },
    // { id: 'masterCard', name: 'MasterCard', logo: 'assets/images/cards/mastercard_logo.png', market: 'international' },
    // {
    //   id: 'dinners-club-internacional',
    //   name: 'Dinners Club Internacional',
    //   logo: 'assets/images/cards/dinners.jpg',
    //   market: 'international',
    // },
    // { id: 'jcb', name: 'JCB', logo: 'assets/images/cards/jcb.png', market: 'international' },
    // { id: 'maestro', name: 'Mastercard Maestro', logo: 'assets/images/cards/maestro.jpg', market: 'international' },
    // { id: 'electron', name: 'Visa Electrón', logo: 'assets/images/cards/electron.png', market: 'international' },
    // { id: 'tarjeta-virtual', name: 'Tarjeta Virtual', logo: 'assets/images/cards/virtual.png', market: 'international' },
    // { id: 'bizum', name: 'Bizum', logo: 'assets/images/cards/bizum.jpg', market: 'international' },
    // { id: 'iupay', name: 'Iupay', logo: 'assets/images/cards/iupay.png', market: 'international' },
    // { id: 'discover-global', name: 'Discover Global', logo: 'assets/images/cards/discover.png', market: 'international' },
  ];

  nationalitiy: any[] = [
    { id: true, name: 'Sí' },
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
  onlyCubanPeople = true;
  finalPrice = 1080;
  shippingData: any[] = [];
  canBeDelivery = true;
  marketCard: string;
  showShipping = false;
  rate: any;
  currencyInternational = environment.currencyInternational;
  private applyStyle: boolean;
  query: IPagination = {
    limit: 1000,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 1,
  };
  private paymentType: any;

  public compareById(val1, val2) {
    return val1 && val2 && val1 == val2;
  }

  public displayCity(city?: any): any {
    return city && city.name ? city.name : undefined;
  }

  constructor(
    public cartService: CartService,
    public productService: ProductService,
    public currencyService: CurrencyService,
    private fb: FormBuilder,
    private regionService: RegionsService,
    public utilsService: UtilsService,
    private payService: PayService,
    public domSanitizer: DomSanitizer,
    public loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService,
    private orderSevice: MyOrdersService,
    private dialog: MatDialog,
    private socketIoService: SocketIoService,
    private activateRoute: ActivatedRoute,
    private shppingService: TaxesShippingService,
    private configurationService: ConfigurationService,
    private currencyCheckoutPipe: CurrencyCheckoutPipe,
    private metaService: MetaService,
    public contactsService: ContactsService,
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

    this.metaService.setMeta(
      environment.meta?.mainPage?.title,
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );

    this.setObsContact();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.applyResolution();
  }

  private applyResolution() {
    const innerWidth = window.innerWidth;
    this.applyStyle = innerWidth <= 600;
  }

  ngOnInit() {
    this.getContacts();

    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.rate = 1;
    this.applyResolution();
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
    // ////////////// Subscripciones para el update del carrito /////////////////
    this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      if (data.length > 0) {
        this.theBusiness = data[0].Business;
      }
      this.processToCart();
    });

    if (this.loggedInUser) {
      this._listenToSocketIO();
    }

    this.form.controls['currency'].valueChanges.subscribe((data) => {
      //this.calculateShippingRequired();
      if (this.currencyInternational === data) {
        this.rate = 1;
      } else {
        let params: any = {
          currencyDestination: data,
          currencyTarget: this.currencyInternational,
        };
        if (this.cart.BusinessId) {
          params = {
            ...params,
            BusinessId: this.cart.BusinessId,
          };
        }
        this.configurationService.getCurrencys(this.query, params).subscribe((response) => {
          if (response.data) {
            this.rate = response.data[0].rate;
          } else {
            this.rate = 1;
          }
        });
      }
    });

    this.form.controls['ProvinceId'].valueChanges.subscribe((data) => {
      this.calculateShippingRequired();
      this.onSelectProvinceByContactBtn(data);
    });

    this.form.controls['MunicipalityId'].valueChanges.subscribe((data) => {
      this.calculateShippingRequired();
    });

    this.form.controls['shippingRequired'].valueChanges.subscribe((value) => {
      this.showShipping = value;
      if (value) {
        this.form.controls['ShippingBusinessId'].setValidators(Validators.required);
        this.onRecalculateShipping();
      } else {
        this.form.controls['ShippingBusinessId'].setValidators(null);
        this.shippingData = [];
        this.canBeDelivery = false;
      }
      this.form.controls['ShippingBusinessId'].updateValueAndValidity();
    });

    this.form.controls['ShippingBusinessId'].valueChanges.subscribe((value) => {
      this.getTotalWithShippingIncluded();
    });
    this.validateShippingRequired();
  }

  private validateShippingRequired() {
    if (this.showShipping) {
      this.form.controls['ShippingBusinessId'].setValidators(Validators.required);
    } else {
      this.form.controls['ShippingBusinessId'].setValidators(null);
    }
    this.form.controls['ShippingBusinessId'].updateValueAndValidity();
  }

  private calculateShippingRequired() {
    if (this.showShipping) {
      this.onRecalculateShipping();
    } else {
      this.shippingData = [];
      this.canBeDelivery = false;
    }
  }

  processToCart() {
    if (!this.cartId) {
      let dialogRef: MatDialogRef<DialogNoCartSelectedComponent, any>;
      dialogRef = this.dialog.open(DialogNoCartSelectedComponent, {
        width: '15cm',
        maxWidth: '100vw',
        data: {},
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    } else {
      this.getCartData();
    }
  }

  detailsShipping() {
    this.dialog.open(DetailsShippingComponent, {
      panelClass: 'app-details-shipping',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        element: this.shippingData,
        market: this.marketCard,
      },
    });
  }

  public getCartData() {
    this.loadingCart = true;
    this.cartService
      .getCartData({ cartId: this.cartId, cartItemIds: this.cartItemIds })
      .then((data) => {
        this.cart = data.Cart;
        this.buyProducts = data.CartItems || [];
        this.dataSource = new MatTableDataSource(this.buyProducts);
        this.marketCard =
          this.buyProducts && this.buyProducts.length > 0 ? this.buyProducts[0].Product.market : MarketEnum.NATIONAL;
        if (this.buyProducts && this.buyProducts.length > 0) {
          this.onRecalculateShipping();
        } else {
          this.shippingData = [];
          this.canBeDelivery = false;
        }

        if (!this.form.get('currency').value) {
          this.form.get('paymentType').setValue('transfermovil');

          if (this.cart.market === MarketEnum.NATIONAL) {
            // this.form.get('paymentType').setValue('transfermovil');
            this.form.get('currency').setValue('USD');
          } else {
            // this.form.get('paymentType').setValue('visa');
            this.form.get('currency').setValue('USD');
          }
        }
        setTimeout(() => {
          this.loadingCart = false;
        }, 250);
      })
      .catch(() => {
        this.loadingCart = false;
      });
  }

  public getTotalWithShippingIncludedCurrency(): any {
    let total = this.getTotalWithShippingIncluded();
    const result = this.currencyCheckoutPipe.transform({
      currency: this.form.get('currency').value,
      value: total,
      rate: this.rate,
    });
    return result;
  }

  public getTotalWithShippingIncluded(): any {
    let total = this.getTotalAmout() as Number;
    let ShippingBusinessId = this.form.get('ShippingBusinessId').value;
    if (ShippingBusinessId) {
      let ShippingByBusiness = this.shippingData?.find((i) => i.BusinessId == ShippingBusinessId);
      return total + (ShippingByBusiness?.totalPrice || 0.0);
    } else {
      return total;
    }
  }

  public getTotalAmountCurrency(): any {
    const subTotal = this.getTotalAmout();
    const result = this.currencyCheckoutPipe.transform({
      currency: this.form.get('currency').value,
      value: subTotal,
      rate: this.rate,
    });
    return result;
  }

  public getTotalAmout(): any {
    const value = this.buyProducts.reduce((prev, curr: CartItem) => {
      return prev + this.getTotalPricePerItem(curr);
    }, 0);

    return value;
  }

  onSubmit(): void {
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public removeItem(item: CartItem) {
    this.loadingCart = true;
    this.loggedInUserService._setDataToStorage('payData', JSON.stringify(this.form.value));
    this.cartService.removeFromCart(item).then();
    setTimeout(() => {
      this.loadingCart = false;
    }, 150);
  }

  buildForm() {
    this.selectedDataPay = this.loggedInUserService._getDataFromStorage('payData');
    this.form = this.fb.group({
      name: [this.selectedDataPay?.name || null, [Validators.required]],
      lastName: [this.selectedDataPay?.lastName || null, [Validators.required]],
      address: [this.selectedDataPay?.address || null, [Validators.required]],
      address2: [this.selectedDataPay?.address2 || null, []],
      city: [this.selectedDataPay?.city || null, [Validators.required]],
      regionProvinceState: [this.selectedDataPay?.regionProvinceState || null, [Validators.required]],
      CountryId: [this.selectedDataPay?.CountryId || 59, [Validators.required]],
      ProvinceId: [this.selectedDataPay?.ProvinceId || null, [Validators.required]],
      MunicipalityId: [this.selectedDataPay?.MunicipalityId || null, [Validators.required]],
      isForCuban: [this.selectedDataPay?.isForCuban || true, [Validators.required]],
      dni: [this.selectedDataPay?.dni || null, [
        Validators.required,
        Validators.minLength(this.CI_Length),
        // Validators.maxLength(11),
      ]],
      email: [this.selectedDataPay?.email || null, [Validators.required, Validators.email]],
      phone: [this.selectedDataPay?.phone || null, []],
      info: [this.selectedDataPay?.info || null, []],
      paymentType: [this.selectedDataPay?.paymentType || PASARELA_BASE, [Validators.required]],
      ShippingBusinessId: [null, []],
      currency: [null, [Validators.required]],
      shippingRequired: [false, []],
    });
    this.onlyCubanPeople = this.form.get('isForCuban').value;
    if (this.onlyCubanPeople) {
      this.form
        .get('phone')
        .setValidators([
          Validators.required,
          Validators.pattern(CUBAN_PHONE_START_5),
          Validators.minLength(8),
          Validators.maxLength(8),
        ]);
    }
    this.updateValidatorsForChangeNationality(this.onlyCubanPeople);
    this.subsToTransfermovilChange();

    this.form.markAllAsTouched();
  }

  subsToTransfermovilChange() {
    this.form.get('paymentType').valueChanges.subscribe((change) => {
      if (change === 'transfermovil') {
        this.form.get('currency').setValue('USD');
      }
    });
  }

  onSelectProvince(provinceId) {
    setTimeout(() => {
      this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
      this.form.get('MunicipalityId').setValue(null);
      this.form.get('ShippingBusinessId').setValue(null);
    }, 0);
  }

  onRecalculateShipping() {
    let data = {
      CountryId: this.form?.get('CountryId').value,
      MunicipalityId: this.form?.get('MunicipalityId').value,
      ProvinceId: this.form?.get('ProvinceId').value,
      ProductIds: this.buyProducts?.map((i) => i.ProductId),
      CartId: +this.cartId,
    };
    if (data.CountryId && data.MunicipalityId && data.ProvinceId) {
      this.inLoading = true;
      this.shppingService.getShippinginCheckout(data).subscribe(
        (dataShipping) => {
          this.shippingData = dataShipping.shippings;
          this.canBeDelivery = dataShipping.canBeDelivery;
          this.inLoading = false;
        },
        (error) => {
          this.inLoading = false;
        },
      );
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
          Validators.pattern(CUBAN_PHONE_START_5),
          Validators.minLength(8),
          Validators.maxLength(8),
        ]);
      this.form.get('phone').updateValueAndValidity();
      this.form.get('paymentType').setValue('transfermovil');
    } else {
      /*Para extrangeros la cosa*/
      this.onlyCubanPeople = false;
      this.form.get('paymentType').setValue('visa');
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
        this.allCountries = this.allCountries.sort(function(a, b) {
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

  getTotalPricePerItemCurrency(item: CartItem) {
    const value = this.getTotalPricePerItem(item);
    const result = this.currencyCheckoutPipe.transform({
      currency: this.form.get('currency').value,
      value: value,
      rate: this.rate,
    });
    return result;
  }

  public getTotalPricePerItem(item: CartItem) {
    let price = this.cartService.getPriceofProduct(item.Product, item.quantity);
    return price * item.quantity;
  }

  filterCities(val) {
    val = val.trim().toLowerCase();
    return this.selectedCities.filter(function(item) {
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
    this.scrollTopDocument();
    this.loadingPayment = true;
    const data = { ...this.form.value };
    data.phone = '53' + data.phone;

    this.paymentType = JSON.parse(JSON.stringify(data.paymentType));
    if (!data.shippingRequired) {
      delete data.ShippingBusinessId;
    }
    //data.currency = this.marketCard === MarketEnum.INTERNATIONAL ? CoinEnum.USD : CoinEnum.CUP;
    data.description = data.description || `Pago realizado por el cliente ${data.name} ${data.lastName}`;
    data.urlClient = environment.url;
    this.loggedInUserService._setDataToStorage('payData', JSON.stringify(this.form.value));
    data.CartItemIds = this.buyProducts.map((item) => item.id);
    data.CartId = +this.cart.id;
    if (data.paymentType == 'transfermovil') {
      return this.processTransfermovil(data);
    }
    if (data.paymentType == 'enzona') {
      return this.processEnzona(data);
    }
    if (data.paymentType == 'visa' || data.paymentType == 'express' || data.paymentType == 'masterCard') {
      data.paymentType = 'bidaiondo';
      return this.processBidaiondo(data);
    }
  }

  ///////////////////////////////////////////////
  processTransfermovil(bodyData) {
    this.payService.makePaymentTransfermovil(bodyData).subscribe(
      (data: any) => {
        if (data && data.data) {
          //this.finalPrice = this.getTotalAmout() as number;
          const price = this.getTotalWithShippingIncluded();
          // const currency = this.marketCard === MarketEnum.INTERNATIONAL ? CoinEnum.USD : CoinEnum.CUP;
          const currency = this.marketCard === CoinEnum.USD;
          let dialogRef: MatDialogRef<DialogTranfermovilQrComponent, any>;

          dialogRef = this.dialog.open(DialogTranfermovilQrComponent, {
            width: '50rem',
            panelClass: 'app-dialog-tranfermovil-qr',
            maxWidth: '99vw',
            maxHeight: '99vh',
            disableClose: true,
            data: {
              paymentData: data.data,
              finalPrice: price,
              currency: currency,
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            console.log('OKOUT_Transfermovil');
          });
        } else {
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

  processBidaiondo(bodyData) {
    bodyData.amex = amexData[this.paymentType];
    console.log('AMEX', bodyData.amex);
    this.payService.makePaymentBidaiondo(bodyData).subscribe(
      (data: any) => {
        let dialogRef: MatDialogRef<DialogBidaiondoConfirmToPayComponent, any>;

        dialogRef = this.dialog.open(DialogBidaiondoConfirmToPayComponent, {
          width: '15cm',
          maxWidth: '100vw',
          data: {
            form: data.data.form,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            window.location.reload();
          }
          this.loadingPayment = false;
        });
      },
      (error) => {
        this.loadingPayment = false;
      },
    );
  }

  // ///////////////////////////////////////////////
  // CONTACTS
  setObsContact() {
    this.contactsService.allContacts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
          this.contactsService.allContacts = response.data;
        },
      );
  }

  getContacts() {
    this.contactsService.getContact.next();
  }

  onAddContact() {
    let dialogRef: MatDialogRef<MyContactsComponent, any>;
    dialogRef = this.dialog.open(MyContactsComponent, {
      panelClass: 'app-my-contacts',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '40rem',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  onSelectContact(contact) {
    this.form.get('name').setValue(contact?.name);
    this.form.get('lastName').setValue(contact?.lastName);
    this.form.get('email').setValue(contact?.email);
    this.form.get('CountryId').setValue(59);
    this.form.get('ProvinceId').setValue(contact?.ProvinceId);
    this.form.get('MunicipalityId').setValue(contact?.MunicipalityId);
    this.form.get('address').setValue(contact?.address);
    this.form.get('dni').setValue(contact?.identification);
    this.form.get('phone').setValue(contact?.phone);
  }

  onSelectProvinceByContactBtn(provinceId) {
    setTimeout(() => {
      this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    }, 0);
  }

  //////////Utiles/////////////////
  _getAddress(user, storagePayData) {
    if (storagePayData) {
      return storagePayData.address;
    }
    // if (user && user.address) {
    //   return user.address;
    // }
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
      return this.getOnly8DigitsPhone(storagePayData.phone);
    }
    if (user && user.phone) {
      return this.getOnly8DigitsPhone(user.phone);
    }
    return null;
  }

  getOnly8DigitsPhone(phone) {
    if (phone.length === 10 && phone.startsWith('53')) {
      phone = phone.slice(2);
    }
    return phone;
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
        this.orderSevice.$orderItemsUpdated.next();
        this.getCartData();
      });

    this.socketIoService
      .listen('payment-error')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.loadingPayment = false;
        this.showToastr.showError(data.message, 'Error', 5000);
      });
  }

  /**
   * ========== ON GO TO PAY =================
   */

  onGoToInfoDataToPay() {
    this.showInfoDataToPay = true;
    this.showPayment = false;
    this.scrollTopDocument();
  }

  onGoToPayment() {
    this.showInfoDataToPay = false;
    this.showPayment = true;
    this.scrollTopDocument();
  }

  scrollTopDocument() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
