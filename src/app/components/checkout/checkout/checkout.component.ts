import { MetaService } from 'src/app/core/services/meta.service';
import { DialogNoCartSelectedComponent } from '../no-cart-selected/no-cart-selected.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PayService } from '../../../core/services/pay/pay.service';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { lastValueFrom, Subject } from 'rxjs';
import { Cart, CartItem, IBusiness } from '../../../modals/cart-item';
import { environment } from '../../../../environments/environment';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CurrencyService } from '../../../core/services/currency/currency.service';
import { IPagination } from '../../../core/classes/pagination.class';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { DialogEnzonaConfirmToPayComponent } from '../dialog-enzona-confirm-to-pay/dialog-enzona-confirm-to-pay.component';
import { ConfirmationDialogFrontComponent } from '../../shared/confirmation-dialog-front/confirmation-dialog-front.component';
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
import { CUBAN_PHONE_START_5, EMAIL_REGEX } from '../../../core/classes/regex.const';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { MyContactsComponent } from '../../main/my-contacts/my-contacts.component';
import * as moment from 'moment';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogPgtConfirmToPayComponent } from '../dialog-pgt-confirm-to-pay/dialog-pgt-confirm-to-pay.component';
import { AppService } from '../../../app.service';
import { DialogAuthorizeConfirmToPayComponent } from '../dialog-authorize-confirm-to-pay/dialog-authorize-confirm-to-pay.component';
import { objectKeys } from 'codelyzer/util/objectKeys';
import { DialogPaypalConfirmToPayComponent } from '../dialog-paypal-confirm-to-pay/dialog-paypal-confirm-to-pay.component';
import { PhoneCodeService } from '../../../core/services/phone-code/phone-codes.service';
import { DialogTropipayConfirmToPayComponent } from '../dialog-tropipay-confirm-to-pay/dialog-tropipay-confirm-to-pay.component';

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
  providers: [CurrencyCheckoutPipe, PhoneCodeService],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  public CI_Length = 11;
  public buyProducts: CartItem[] = [];
  public cart: Cart;
  public loading = false;
  public onMarket = false;
  public arrPayments: any[] = [];
  public cartId = undefined;
  public BusinessId = undefined;
  public cartItemIds: any[] = undefined;
  public theBusiness: IBusiness;

  public showInfoDataToPay = true;
  public showPayment = false;
  inLoading = false;
  loadingPayment = false;
  loadingShipping = false;
  buscoShipping = false;
  launchTM = undefined;
  currencies = ['USD', 'EUR'];
  currenciesTuUse: any[] = [];
  currenciesTransfermovil = [
    {
      name: 'MLC',
      value: 'USD',
    },
    {
      name: 'CUP',
      value: 'CUP',
    }];
  multiTransfermovil = false;
  dataSource: MatTableDataSource<any>;
  amount: number;

  shippingSelected: any;
  bidaiondoCards: any[] = [
    'visa',
    'express',
    'masterCard',
    'dinners-club-internacional',
    'jcb',
    'maestro',
    'electron',
    'tarjeta-virtual',
    'bizum',
    'iupay',
    'discover-global',
  ];

  payments: any[] = [
    {
      id: 'enzona',
      enabled: false,
      name: 'Enzona',
      logo: 'assets/images/cards/enzona.jpeg',
      market: 'national',
    },
    {
      id: 'transfermovil',
      enabled: false,
      name: 'Transfermovil',
      logo: 'assets/images/cards/transfermovil_logo.png',
      market: 'national',
    },
    {
      id: 'transfermovil',
      enabled: false,
      name: 'Transfermovil',
      logo: 'assets/images/cards/transfermovil_logo.png',
      market: 'international',
    },
    {
      id: 'peoplegoto',
      enabled: false,
      name: 'Visa',
      logo: 'assets/images/cards/peopleGoTo.png',
      market: 'international',
    },
    {
      id: 'authorize',
      enabled: false,
      name: 'Authorize',
      logo: 'assets/images/cards/authorizenet.png',
      market: 'international',
    },
    { id: 'visa', name: 'Visa', amex: 2, logo: 'assets/images/cards/visa_logo.png', market: 'international' },
    {
      id: 'express',
      name: 'American Express',
      amex: 2,
      logo: 'assets/images/cards/american_express_logo.png',
      market: 'international',
    },
    {
      id: 'masterCard',
      name: 'MasterCard',
      amex: 3,
      logo: 'assets/images/cards/mastercard_logo.png',
      market: 'international',
    },
    {
      id: 'dinners-club-internacional',
      name: 'Dinners Club Internacional',
      amex: 4,
      logo: 'assets/images/cards/dinners.jpg',
      market: 'international',
    },
    { id: 'jcb', name: 'JCB', amex: 5, logo: 'assets/images/cards/jcb.png', market: 'international' },
    {
      id: 'maestro',
      name: 'Mastercard Maestro',
      amex: 9,
      logo: 'assets/images/cards/maestro.jpg',
      market: 'international',
    },
    {
      id: 'electron',
      name: 'Visa Electrón',
      amex: 10,
      logo: 'assets/images/cards/electron.png',
      market: 'international',
    },
    {
      id: 'tarjeta-virtual',
      name: 'Tarjeta Virtual',
      amex: 11,
      logo: 'assets/images/cards/virtual_card.svg',
      market: 'international',
    },
    { id: 'bizum', amex: 12, name: 'Bizum', logo: 'assets/images/cards/bizum.jpg', market: 'international' },
    { id: 'iupay', amex: 13, name: 'Iupay', logo: 'assets/images/cards/iupay.png', market: 'international' },
    {
      id: 'discover-global',
      amex: 14,
      name: 'Discover Global',
      logo: 'assets/images/cards/discover.png',
      market: 'international',
    },
    {
      id: 'paypal',
      enabled: false,
      name: 'PayPal',
      market: 'international',
      logo: 'assets/images/cards/paypal.png',
    },
    {
      id: 'multisafepay',
      enabled: false,
      name: 'MultiSafePay',
      logo: 'assets/images/cards/multisafepay.png',
      market: 'international',
    },
    {
      id: 'tropipay',
      enabled: false,
      name: 'TropiPay',
      logo: 'assets/images/cards/tropipay.png',
      market: 'international',
    },
  ];
  language: any;
  _unsubscribeAll: Subject<any>;
  imageUrl = environment.imageUrl;
  loggedInUser: any = null;
  selectedMunicipality: any = null;
  form: UntypedFormGroup;
  selectedDataPay: any = null;
  loadingCart = true;
  hasPickUpPlace = false;
  minDate = moment()
    .add(3, 'd') // replace 2 with number of days you want to add
    .toDate(); // convert it to a Javascript Date Object if you like
  minHour = '9:00';
  maxHour = '21:00';
  timePickerTheme: NgxMaterialTimepickerTheme = {
    container: {
      buttonColor: '#1e4286',
    },
    dial: {
      dialBackgroundColor: '#1e4286',
    },
    clockFace: {
      clockHandColor: '#1e4286',
    },
  };

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
  canBeDelivery = false;
  delivery = false;
  marketCard: string;
  showShipping = false;
  showAddress = false;
  rate: any;
  currencyInternational = environment.currencyInternational;
  query: IPagination = {
    limit: 1000,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 1,
  };
  // tslint:disable-next-line: member-ordering
  qrO: any = {
    qr: 'data:image/png;base64,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',
    PaymentCode: 'exp-p-00000-00074',
    succes: true,
  };
  private applyStyle: boolean;
  private paymentType: any;

  customFields: any;
  fields: any;
  shippingIsRequired = false;

  public buyWithDiscount: any;
  fixShippingBusiness: any;
  fixedShipping: any;

  defaultContact: any;
  businessConfig;
  noGateway = true;

  callingCodeDisplayOptions = {
    firthLabel: [
      {
        type: 'path',
        path: ['code'],
      },
    ],
  };

  constructor(
    public cartService: CartService,
    public appService: AppService,
    public productService: ProductService,
    public currencyService: CurrencyService,
    private fb: UntypedFormBuilder,
    private regionService: RegionsService,
    public utilsService: UtilsService,
    private payService: PayService,
    public domSanitizer: DomSanitizer,
    public loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService,
    private orderService: MyOrdersService,
    private dialog: MatDialog,
    private socketIoService: SocketIoService,
    private activateRoute: ActivatedRoute,
    private shippingService: TaxesShippingService,
    private configurationService: ConfigurationService,
    private currencyCheckoutPipe: CurrencyCheckoutPipe,
    private metaService: MetaService,
    public contactsService: ContactsService,
    public router: Router,
    private spinner: NgxSpinnerService,
    public phoneCodesService: PhoneCodeService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.setObsContact();
    this.getContacts();
    // this.getAvalilablePaymentType();
    this.buildForm();

    this.form.get('paymentType').valueChanges.subscribe(item => {
      console.log(this.form.get('paymentType').value.length);
      console.log(this.form.get('paymentType').value);
    });

    this.activateRoute.queryParams.subscribe((data) => {
      this.cartId = data.cartId;
      this.BusinessId = data.BusinessId;
      this.cartItemIds = data.cartIds;
      this.cartItemIds =
        this.cartItemIds && this.cartItemIds.constructor != Array ? [this.cartItemIds] : this.cartItemIds;
      this.processToCart();
    });
  }

  public getBusinessConfig(id) {
    this.appService.getBusinessConfigId(id).subscribe((item) => {
      // this.loading = true;
      this.businessConfig = item.data;
      this.showAddress = this.businessConfig?.showAddress;
      this.form.get('shippingType').setValue(this.businessConfig?.shippingType);
      this.form.get('configProductsType').setValue(this.businessConfig?.configProductsType);
      if (this.businessConfig?.isDniRequired) {
        this.form.get('dni').setValidators(Validators.required);
      } else {
        this.form.get('dni').setValidators([]);
      }
      this.getAvalilablePaymentType();
      if (this.businessConfig?.gateways?.length == 0) {
        this.noGateway = true;
      } else {
        this.noGateway = false;
      }
    });
  }

  public getAvalilablePaymentType() {
    let auxPayments = [];
    let searchBidaindoCards: boolean;
    let enabledGates;
    if (this.cart.currenciesGateway) {
      if (objectKeys(this.cart.currenciesGateway).length > 0) {
        this.onMarket = true;
        if (this.cart.currenciesGateway?.transfermovil?.currency.length > 0) {
          this.cart.currenciesGateway?.transfermovil?.currency.forEach(item => {
            switch (item) {
              case 'CUP': {
                this.currenciesTuUse.push(this.currenciesTransfermovil[1]);
                break;
              }
              case 'USD': {
                this.currenciesTuUse.push(this.currenciesTransfermovil[0]);
                break;
              }
            }
          });
          this.multiTransfermovil = true;
        } else {
          this.multiTransfermovil = false;
        }
        objectKeys(this.cart.currenciesGateway).forEach(item => {
          this.arrPayments.push(item);
        });
        enabledGates = this.arrPayments;
        console.log(enabledGates);
      } else {
        this.onMarket = false;
        enabledGates = this.businessConfig?.gateways;
      }
    }


    this.payments.forEach((item, index) => {
      if (Array.isArray(enabledGates) && enabledGates.includes(item.id)) {
        auxPayments.push(this.payments[index]);
      }
      if (
        Array.isArray(enabledGates) &&
        !enabledGates.includes(item.id) &&
        enabledGates.includes('bidaiondo') &&
        this.bidaiondoCards.includes(item.id)
      ) {
        auxPayments.push(this.payments[index]);
      }
    });
    this.payments = auxPayments;
    console.log(this.payments);

    if (this.businessConfig?.gateways) {
      if (this.businessConfig?.gateways.length > 0) {
        this.noGateway = false;
        if (this.onMarket) {
          this.form.get('paymentType').setValue(this.arrPayments);
        } else {
          this.form.get('paymentType').setValue(this.businessConfig.gateways);
          if (this.cart.market === 'national') {
            this.currencyInternational = 'CUP';
          } else if (this.cart.market === 'international') {
            this.currencyInternational = 'USD';
          }
        }
        this.spinner.show();
        if (this.arrPayments.find((item) => item === 'bidaiondo')) {
          this.getEnabledBidaiondoCards();
          this.spinner.hide();
        }
      } else {
        this.noGateway = true;
        this.spinner.hide();
      }
      this.spinner.hide();
    }
  }

  public getEnabledBidaiondoCards() {
    const paymentsCards = [];
    this.payService.getBidaiondoCards().subscribe({
      next: (data) => {
        for (let item of this.payments) {
          if (!item.amex || data.includes(item.amex.toString())) {
            paymentsCards.push(item);
          }
        }
        this.payments = paymentsCards;
      },
      error: (error) => {
      },
    });
  }

  public compareById(val1, val2) {
    return val1 && val2 && val1 == val2;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.applyResolution();
  }

  ngOnInit() {

    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.rate = 1;
    this.applyResolution();
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
      if (this.loggedInUser) {
      }
    });
    this.fetchData();

    /**
     * Subscriptions for cart update
     */


    this.form.controls['currency'].valueChanges.subscribe((data) => {
      console.log(this.currencyInternational);
      console.log(data);
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
            this.rate = response.data[0]?.rate || 1;
          } else {
            this.rate = 1;
          }
        });
      }
    });

    this.form.controls['paymentType'].valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      if (data && (data == 'peoplegoto' || data == 'authorize' || data == 'multisafepay' || data === 'tropipay')) {
        this.form.controls['currency'].setValue(CoinEnum.EUR);
      } else if (data === 'paypal') {
        this.form.controls['currency'].setValue(CoinEnum.USD);
      } else if (data === 'transfermovil' || data === 'enzona') {
        if (this.cart.market === 'international') {
          this.currencyInternational = 'USD';
          this.form.get('currency').setValue('USD');
        } else if (this.cart.market === 'national') {
          this.currencyInternational = 'CUP';
          this.form.get('currency').setValue('CUP');
        } else {
          // this.currencyInternational = 'USD';
        }
      }
      this.onRecalculateShipping();
    });

    this.form.controls['ProvinceId'].valueChanges.subscribe((data) => {
      this.calculateShippingRequired();
      this.onSelectProvinceByContactBtn(data);
      /** Validate contact province most be equal to shipping province **/
      if (
        this.showShipping &&
        this.shippingSelected &&
        data != this.shippingSelected.shippingItems[0].Shipping.ProvinceId
      ) {
        this.form.controls['ProvinceId'].setErrors({ forbiddenProvince: { value: data } });
      }
    });

    this.form.controls['MunicipalityId'].valueChanges.subscribe((data) => {
      this.selectedMunicipality = this.allMunicipalities.find(item => data === item.id);
      if (data && this.form.controls['currency'].value) {
        this.calculateShippingRequired();
      }
    });

    this.form.controls['currency'].valueChanges.subscribe((data) => {
      this.selectedMunicipality = this.allMunicipalities.find(item => data === item.id);
      if (data && this.form.controls['currency'].value) {
        this.calculateShippingRequired();
      }
      this.getTotalWithShippingIncluded();
    });

    this.form.controls['ShippingBusinessId'].valueChanges.subscribe((value) => {
      this.getTotalWithShippingIncluded(value);
    });
    this.validateShippingRequired();
  }

  onChangeShippingRequired(data) {
    this.showShipping = data.checked;
    if (data.checked) {
      this.form.get('ShippingBusinessId').setValidators(Validators.required);
      this.onRecalculateShipping();
    } else {
      this.form.get('ShippingBusinessId').setValue(null);
      this.form.get('ShippingBusinessId').clearValidators();
      this.shippingData = [];
    }
    this.form.get('ShippingBusinessId').updateValueAndValidity();
  }

  onChangeShippingRequiredDefault(data) {
    this.showShipping = data;
    if (data) {
      this.form.get('ShippingBusinessId').setValidators(Validators.required);
      this.onRecalculateShipping();
    } else {
      this.form.get('ShippingBusinessId').setValue(null);
      this.form.get('ShippingBusinessId').clearValidators();
      this.shippingData = [];
    }
    this.form.get('ShippingBusinessId').updateValueAndValidity();
  }

  /**
   * Obtain location from shipping option selected
   *
   * @param data Shipping option selected
   */
  onShippingSelected(data) {
    console.log(data);
    this.shippingSelected = data.value;
    this.form.get('ShippingBusinessId').setValue(data.value);
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
    console.log('llega aqui', this.showShipping);
    if (this.showShipping) {
      this.onRecalculateShipping();
    } else {
      this.shippingData = [];
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

  public getCartData() {
    this.loadingCart = true;
    this.cartService.getCartData({ cartId: this.cartId, cartItemIds: this.cartItemIds }).subscribe({
        next: (data) => {
          console.log(data);
          if (data.CartItems.length === 0) {
            this.router.navigate(['']);
          } else {
            this.cart = data.Cart;
            this.getBusinessConfig(this.cart?.BusinessId);
            this.buyProducts = data.CartItems || [];
            // Obtain data for fixed shipping value
            this.buyWithDiscount = data.discount.priceWithDiscount ? data.discount : null;
            this.fixShippingBusiness = data.Cart.BusinessId;
            // Obtain data for fixed shipping value
            this.buyWithDiscount = data.discount.priceWithDiscount ? data.discount : null;
            this.fixShippingBusiness = data.Cart.BusinessId;
            // Check if is required shipping by business
            this.shippingIsRequired = data.Cart.Business.shippingRequired;
            if (this.shippingIsRequired) {
              this.form.controls['shippingRequired'].setValue(this.shippingIsRequired);
              this.onChangeShippingRequiredDefault(this.shippingIsRequired);
              this.form.controls['shippingRequired'].setValidators(Validators.required);
              this.form.controls['ShippingBusinessId'].setValidators(Validators.required);
              this.form.controls['shippingRequired'].updateValueAndValidity();
            }
            // Check if the Pick-Up-Place label has to be displayed
            if (data.CartItems.filter((item) => item.Product.type === 'physical').length > 0) {
              this.hasPickUpPlace = true;
            } else {
              this.hasPickUpPlace = false;
            }
            // if (this.cart.market === 'national' && !this.onMarket) {
            //   this.form.controls['currency'].setValue('CUP');
            // }
            this.dataSource = new MatTableDataSource(this.buyProducts);
            this.marketCard =
              this.buyProducts && this.buyProducts.length > 0 ? this.buyProducts[0].Product.market : MarketEnum.NATIONAL;
            // if (this.buyProducts && this.buyProducts.length > 0 && ) {
            //   this.onRecalculateShipping();
            // } else {
            this.shippingData = [];
            this.loading = true;
            // }
            if (this.cart.market === MarketEnum.NATIONAL && !this.onMarket) {
              this.form.get('currency').setValue(CoinEnum.CUP);
            }
            if (this.cart.market === MarketEnum.INTERNATIONAL && !this.onMarket) {
              this.form.get('currency').setValue(CoinEnum.USD);
            }
            this.cartService.$cartItemsUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
              if (data.length > 0) {
                console.log(this.cart);
                this.theBusiness = data[0].Business;
              }
            });
            setTimeout(() => {
              this.loadingCart = false;
            }, 250);
            this.form.updateValueAndValidity();
          }

        },
        error: (err) => {
          console.log('________________________________________________________________');
          this.showToastr.showError(err.message);
          this.loadingCart = false;
        },
      },
    );
  }

  getShippingSelectedPrice() {
    return this.shippingSelected?.totalPrice;
  }

  public getTotalWithShippingIncludedCurrency(): any {
    return this.getTotalWithShippingIncluded();

    // console.log(this.currencyCheckoutPipe.transform({
    //   currency: this.form.get('currency').value,
    //   value: total,
    //   rate: this.rate,
    // }));
    // return this.currencyCheckoutPipe.transform({
    //   currency: this.form.get('currency').value,
    //   value: total,
    //   rate: this.rate,
    // });
  }

  public getTotalWithShippingIncluded(shipping?: any): any {
    // console.log(shipping);

    let total = this.getTotalAmountCurrency() as Number;
    let ShippingBusinessId = this.shippingSelected;
    if (ShippingBusinessId) {
      let ShippingByBusiness = this.shippingData?.find(
        (i) =>
          i.BusinessId === ShippingBusinessId.BusinessId &&
          i.shippingItems[0].Shipping?.ProvinceId === this.form.get('ProvinceId').value &&
          i.shippingItems[0].Shipping?.MunicipalityId === this.form.get('MunicipalityId').value,
      );
      return total + (ShippingByBusiness?.totalPrice || 0.0);
    }
    // Total if shipping is fixed
    if (
      this.form.controls['shippingRequired'].value &&
      this.fixedShipping &&
      this.fixedShipping.fixShipingg &&
      this.fixedShipping.totalPrice >= 0 &&
      this.fixedShipping?.provinces.includes(this.form.get('ProvinceId').value)
    ) {
      return total + (this.fixedShipping?.totalPrice || 0.0);
    }

    return total;
  }

  getFixedShippingPrice(price: any): any {
    return this.currencyCheckoutPipe.transform({
      currency: this.form.get('currency').value,
      value: price,
      rate: this.rate,
    });
  }

  public getTotalAmountCurrency(): any {
    const subTotal = this.getTotalAmout();
    return this.currencyCheckoutPipe.transform({
      currency: this.form.get('currency').value,
      value: subTotal,
      rate: this.rate,
    });
  }

  public getTotalAmout(): any {
    if (this.buyWithDiscount?.discount) {
      // tslint:disable-next-line:radix
      return parseInt(this.buyWithDiscount?.priceWithDiscount);
    }

    return this.buyProducts.reduce((prev, curr: CartItem) => {
      return prev + this.getTotalPricePerItem(curr);
    }, 0);
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
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      address: this.fb.group({
        street: [null, [Validators.required]],
        number: [null, [Validators.required]],
        between: [null, [Validators.required]],
      }),
      address2: [null, []],
      city: [null, []],
      regionProvinceState: [null, [Validators.required]],
      CountryId: [59, [Validators.required]],
      ProvinceId: [null, this.showAddress ? [ Validators.required] : []],
      MunicipalityId: [null, this.showAddress ? [ Validators.required] : []],
      isForCuban: [true, [Validators.required]],
      dni: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      phone: [null, []],
      PhoneCallingCodeId: [null, []],
      info: [null, []],
      paymentType: [null, [Validators.required]],
      checkAge: [null, [Validators.required]],
      ShippingBusinessId: [null, []],
      shippingType: [this.businessConfig ? this.businessConfig?.shippingType : null],
      configProductsType: [this.businessConfig ? this.businessConfig?.configProductsType : null],
      currency: [null, []],
      shippingRequired: [null, []],
    });
    if (!this.canBeDelivery && !this.showAddress) {
      this.form.controls['address'].get('street').setValidators([]);
      this.form.controls['address'].get('number').setValidators([]);
      this.form.controls['address'].get('between').setValidators([]);
      this.form.get('regionProvinceState').setValidators([]);
      this.form.get('CountryId').setValidators([]);
      this.form.get('ProvinceId').setValidators([]);
      this.form.get('MunicipalityId').setValidators([]);
    }
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
    this.form.valueChanges.subscribe(data => {
      console.log(this.form);
    });
    this.form.updateValueAndValidity();
    this.updateValidatorsForChangeNationality(this.onlyCubanPeople);
    this.subsToTransfermovilChange();
  }

  isRequiredField(field: string) {
    const response = this.fields.filter((item) => item.name === field && item.required);
    if (response.length) {
      return true;
    } else {
      return;
    }
  }

  fillLoggedInfo() {
    // console.log('businessConfig' + JSON.parse(this.businessConfig.gateways));
    this.form.get('name').setValue(this.loggedInUser?.name);
    this.form.get('lastName').setValue(this.loggedInUser?.lastName);
    this.form.get('phone').setValue(this.loggedInUser?.phone);
    this.form.get('dni').setValue(this.loggedInUser?.ci);
    this.form.get('email').setValue(this.loggedInUser?.email);
    // this.form.get('paymentType').setValue(this.businessConfig.gateways);
    this.form.get('regionProvinceState').setValue(null);
    // this.form.controls['address'].get('street').setValue(null);
    // this.form.controls['address'].get('number').setValue(null);
    // this.form.controls['address'].get('between').setValue(null);
    // this.form.get('CountryId').setValue(null);
    // this.form.get('ProvinceId').setValue(null);
    // this.form.get('MunicipalityId').setValue(null);
  }

  subsToTransfermovilChange() {
    if (this.onMarket) {
      this.form.get('paymentType').valueChanges.subscribe((change) => {
        if (change === 'transfermovil' && this.cart.market === 'international') {
          this.form.get('currency').setValue('USD');
        } else if (change === 'transfermovil' && this.cart.market === 'national') {
          this.form.get('currency').setValue('CUP');
        }
      });
    }
  }

  onSelectProvince(provinceId) {
    setTimeout(() => {
      this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
      this.form.get('MunicipalityId').setValue(null);
      this.form.get('ShippingBusinessId').setValue(null);
    }, 0);
  }

  onRecalculateShipping() {
    if (this.form.controls['currency'].value && this.form.controls['MunicipalityId'].value) {
      let dataCartId = {
        cartId: this.cartId,
        MunicipalityId: this.form.controls['MunicipalityId'].value,
        currency: this.form.controls['currency'].value,
      };
      this.loadingShipping = true;
      this.buscoShipping = true;
      this.loading = false;
      this.cartService.getShippingCart(dataCartId, this.BusinessId).subscribe({
        next: (item) => {
          this.shippingData = item?.shippings;
          this.fixedShipping = item;
          console.log(this.fixedShipping);
          this.loading = true;
          this.loadingShipping = false;
          console.log(item);
          this.canBeDelivery = item?.canBeDelivery;
          this.inLoading = false;
        },
        error: (error) => {
          this.loadingShipping = false;
          this.inLoading = false;
        },
      });
    }
  }

  onFixedHomeDelivery(event) {
    if (!event.checked) {
      this.form.controls['ShippingBusinessId'].setValue(null);
      return;
    }
    this.form.controls['ShippingBusinessId'].setValue(this.fixShippingBusiness);
    this.getFixedShipping();
  }

  getFixedShipping() {
    let data = {
      CountryId: this.form?.get('CountryId').value,
      MunicipalityId: this.form?.get('MunicipalityId').value,
      ProvinceId: this.form?.get('ProvinceId').value,
      ProductIds: this.buyProducts?.map((i) => i.ProductId),
      CartId: +this.cartId,
    };
    if (data.CartId && data.ProductIds) {
      this.inLoading = true;
      this.shippingService.getShippinginCheckout(data).subscribe({
        next: (dataShipping) => {
          if (Array.isArray(dataShipping.shippings)) {
            this.shippingData = dataShipping.shippings;
            this.fixedShipping = dataShipping.shippings;
            console.log(this.fixedShipping);
          } else {
            this.fixedShipping = dataShipping.shippings;
          }
          this.canBeDelivery = dataShipping.canBeDelivery;
          this.inLoading = false;
        },
        error: (error) => {
          this.inLoading = false;
        },
      });
    }
  }

  updateValidatorsForChangeNationality(isForCuban) {
    if (isForCuban) {
      // this.form.get('city').disable();
      this.form.get('regionProvinceState').disable();
      this.form.get('ProvinceId').enable();
      this.form.get('MunicipalityId').enable();
    } else {
      // this.form.get('city').enable();
      this.form.get('regionProvinceState').enable();
      this.form.get('ProvinceId').disable();
      this.form.get('MunicipalityId').disable();
    }
    this.form.updateValueAndValidity();
  }

  ///////////////////////////////
  fetchData() {
    // Get Shipping
    let dataCartId = { cartId: this.cartId };
    this.inLoading = true;

    // Get Custom Fields By CartId
    this.configurationService.getCustomFields(dataCartId).subscribe((data) => {
      this.customFields = data.data;
      if (this.customFields?.length > 0) {
        for (let val of this.customFields) {
          this.fields = val.data;
          this.form.addControl('data', new UntypedFormGroup(this.addingControls(this.fields)));
        }
      }
    });

    // Get Location Data
    this.regionService.getAllCountries(this.queryCountries).subscribe({
      next: (data) => {
        this.allCountries = data.data.filter((item) => item.name.es != undefined);
        this.allCountries.sort(function(a, b) {
          if (a.name['es'] > b.name['es']) {
            return 1;
          } else if (a.name['es'] < b.name['es']) {
            return -1;
          } else {
            return 0;
          }
        });
      },
      error: (error) => {
        this.utilsService.errorHandle(error);
      },
    });
    this.regionService.geBusinessProvinces(dataCartId).subscribe((data) => {
      this.allProvinces = data.data;
    });
    this.regionService.getMunicipalities().subscribe((data) => {
      this.allMunicipalities = data.data;
      this.municipalities = this.allMunicipalities.filter(
        (item) => item.ProvinceId == this.form.get('ProvinceId').value,
      );
    });
  }

  addingControls(fields: any) {
    let controls = {};
    fields.forEach((item) => {
      if (item.type === 'INTEGER') {
        controls[item.name] = new FormControl(
          null,
          item.required ? [Validators.required, Validators.pattern('^[0-9]*$')] : [Validators.pattern('^[0-9]*$')],
        );
      }
      if (item.type === 'STRING') {
        controls[item.name] = new FormControl(
          null,
          item.required
            ? [Validators.required, Validators.pattern('^[a-zA-Z0-9 _.-]*$')]
            : [Validators.pattern('^[a-zA-Z0-9 _.-]*$')],
        );
      }
      if (item.type === 'DATE' || item.type === 'TIME') {
        controls[item.name] = new FormControl(null, item.required ? [Validators.required] : []);
      }
    });
    return controls;
  }

  public getTotalPricePerItem(item: CartItem) {
    let price = this.cartService.getPriceofProduct(item.Product, item.quantity);
    return price * item.quantity;
  }

  onPayOrder() {
    this.scrollTopDocument();
    this.loadingPayment = true;

    if (this.form.get('ShippingBusinessId').value && typeof this.form.get('ShippingBusinessId').value === 'object') {
      this.form.get('ShippingBusinessId').setValue(this.form.get('ShippingBusinessId').value.BusinessId);
    }

    const data = { ...this.form.value };
    console.log(data);
    data.phone = '53' + data.phone;

    this.paymentType = JSON.parse(JSON.stringify(data.paymentType));
    if (this.onMarket) {
    } else {
      if (this.cart.market === 'national') {
        data.currency = 'CUP';
      } else {
        data.currency = 'USD';
      }
    }
    if (!data.shippingRequired) {
      delete data.ShippingBusinessId;
    }
    data.description = data.description || `Pago realizado por el cliente ${data.name} ${data.lastName}`;
    data.urlClient = environment.url;
    data.CartItemIds = this.buyProducts.map((item) => item.id);
    data.CartId = +this.cart.id;

    if (data.paymentType == 'transfermovil') {
      return this.processTransfermovil(data);
    }
    if (data.paymentType == 'enzona') {
      return this.processEnzona(data);
    }
    if (data.paymentType == 'peoplegoto') {
      data.paymentType = 'peoplegoto';
      return this.processBidaiondo(data);
    }
    if (data.paymentType == 'visa' || data.paymentType == 'express' || data.paymentType == 'masterCard') {
      data.paymentType = 'bidaiondo';
      return this.processBidaiondo(data);
    }
    if (data.paymentType == 'authorize') {
      data.paymentType = 'authorize';
      return this.processBidaiondo(data);
    }
    if (data.paymentType == 'paypal') {
      data.paymentType = 'paypal';
      return this.processBidaiondo(data);
    }
    if (data.paymentType == 'multisafepay') {
      data.paymentType = 'multisafepay';
      return this.processBidaiondo(data);
    }
    if (data.paymentType == 'tropipay') {
      data.paymentType = 'tropipay';
      return this.processBidaiondo(data);
    }
  }

  // /////////////////////////////////////////////
  processTransfermovil(bodyData) {
    this.payService.makePaymentTransfermovil(bodyData).subscribe({
      next: (data: any) => {
        if (data && data.data) {
          const price = this.getTotalWithShippingIncluded();
          const currency = this.form.controls['currency'].value;
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
          });
        } else {
          this.loadingPayment = false;
          this.showToastr.showError('Error en la respuesta, fallo en la obtencion del qr');
        }
      },
      error: (error) => {
        this.loadingPayment = false;
      },
    });
  }

  processEnzona(bodyData) {
    const link: any = document.getElementById('pasarelaLink');
    this.payService.makePaymentEnzona(bodyData).subscribe({
      next: (data: any) => {
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
      error: (error) => {
        this.loadingPayment = false;
      },
    });
  }

  processBidaiondo(bodyData) {
    let paymentMethod;
    if (bodyData.paymentType === 'peoplegoto') {
      bodyData.amex = null;
      paymentMethod = this.payService.makePaymentPeopleGoTo(bodyData);
      bodyData.currency = 'EUR';
      paymentMethod.subscribe(
        (data: any) => {
          console.log(data);
          let dialogRef: MatDialogRef<DialogPgtConfirmToPayComponent, any>;

          dialogRef = this.dialog.open(DialogPgtConfirmToPayComponent, {
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
    } else if (bodyData.paymentType === 'authorize') {
      bodyData.urlRedirectSuccesfully = environment.url + 'my-orders';
      bodyData.urlRedirectCancel = environment.url + 'my-orders';
      paymentMethod = this.payService.makePaymentAuthorize(bodyData);
      bodyData.currency = 'EUR';
      paymentMethod.subscribe(
        (data: any) => {
          console.log(data);
          let dialogRef: MatDialogRef<DialogAuthorizeConfirmToPayComponent, any>;

          dialogRef = this.dialog.open(DialogAuthorizeConfirmToPayComponent, {
            width: '15cm',
            maxWidth: '100vw',
            data: {
              form: data,
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
    } else if (bodyData.paymentType === 'paypal') {
      bodyData.urlRedirectSuccesfully = environment.url + 'my-orders';
      bodyData.urlRedirectCancel = environment.url + 'my-orders';
      paymentMethod = this.payService.makePaymentPaypal(bodyData);
      bodyData.currency = 'USD';
      paymentMethod.subscribe(
        (data: any) => {
          console.log(data);
          let dialogRef: MatDialogRef<DialogPaypalConfirmToPayComponent, any>;

          dialogRef = this.dialog.open(DialogPaypalConfirmToPayComponent, {
            width: '15cm',
            maxWidth: '100vw',
            data: {
              form: data,
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
    } else if (bodyData.paymentType === 'multisafepay') {
      bodyData.urlRedirectSuccesfully = environment.url + 'my-orders';
      bodyData.urlRedirectCancel = environment.url + 'my-orders';
      paymentMethod = this.payService.makePaymentMultisafepay(bodyData);
      bodyData.currency = 'EUR';
      paymentMethod.subscribe(
        (data: any) => {
          console.log(data);
          let dialogRef: MatDialogRef<DialogPaypalConfirmToPayComponent, any>;

          dialogRef = this.dialog.open(DialogPaypalConfirmToPayComponent, {
            width: '15cm',
            maxWidth: '100vw',
            data: {
              form: data,
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
    } else if (bodyData.paymentType === 'tropipay') {
      bodyData.urlRedirectSuccesfully = environment.url + 'my-orders';
      bodyData.urlRedirectCancel = environment.url + 'my-orders';
      paymentMethod = this.payService.makePaymentTropipay(bodyData);
      bodyData.currency = 'EUR';
      paymentMethod.subscribe(
        (data: any) => {
          console.log(data);
          let dialogRef: MatDialogRef<DialogTropipayConfirmToPayComponent, any>;

          dialogRef = this.dialog.open(DialogTropipayConfirmToPayComponent, {
            width: '15cm',
            maxWidth: '100vw',
            data: {
              form: data,
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
    } else {
      bodyData.amex = amexData[this.paymentType];
      paymentMethod = this.payService.makePaymentBidaiondo(bodyData);

      paymentMethod.subscribe(
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

  }

  // CONTACTS
  setObsContact() {
    this.contactsService.allContacts$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.contactsService.allContacts = response.data;
      this.defaultContact = response.data.filter((item) => item.selected);
      // Fill form with default contact
      // if (this.defaultContact.length) {
      //   this.form.patchValue(this.defaultContact[0]);
      //   this.form.get('dni').setValue(this.defaultContact[0]?.identification);
      //   this.form.markAllAsTouched();
      // }
    });
  }

  getContacts() {
    this.contactsService.getContact.next('');
  }

  // ///////////////////////////////////////////////

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
    // this.form.get('ProvinceId').setValue(contact?.ProvinceId);
    // this.form.get('MunicipalityId').setValue(contact?.MunicipalityId);
    this.form.get('address').get('street').setValue(contact?.address.street);
    this.form.get('address').get('number').setValue(contact?.address.number);
    this.form.get('address').get('between').setValue(contact?.address.between);
    this.form.get('dni').setValue(contact?.identification);
    this.form.get('phone').setValue(contact?.phone);
    // this.form.get('paymentType').setValue(this.businessConfig.gateways);

    this.form.markAllAsTouched();
  }

  onSelectProvinceByContactBtn(provinceId) {
    setTimeout(() => {
      this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    }, 0);
  }

  /**
   * ========== ON GO TO PAY =================
   */
  onGoToPayment() {
    if (this.form.get('shippingRequired').value === null) {
      this.form.get('shippingRequired').setValue(false);
    }
    const name = this.form.get('name').value;
    const lastName = this.form.get('lastName').value;

    const dialogRef = this.dialog.open(ConfirmationDialogFrontComponent, {
      data: {
        title: 'Confirmación',
        textHtml: `<p style='font-size:18px'>¿Estás seguro que el destinario de la compra es <strong>${name} ${lastName}</strong>?</p>`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.showInfoDataToPay = false;
      this.showPayment = true;
      this.scrollTopDocument();
    });
  }

  scrollTopDocument() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  private applyResolution() {
    const innerWidth = window.innerWidth;
    this.applyStyle = innerWidth <= 600;
  }
}
