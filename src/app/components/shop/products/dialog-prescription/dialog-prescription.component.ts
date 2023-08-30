import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from '../../../../../environments/environment';
import { CartService } from '../../../shared/services/cart.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { Cart } from '../../../../modals/cart-item';
import { DialogUploadMediaComponent } from '../../../shared/dialog-upload-media/dialog-upload-media.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Sign {
  value: string;
  viewValue: string;
}

interface SignArray {
  disabled?: boolean;
  name: string;
  sign: Sign[];
}

@Component({
  selector: 'app-dialog-prescription',
  templateUrl: './dialog-prescription.component.html',
  styleUrls: ['./dialog-prescription.component.scss']
})
export class DialogPrescriptionComponent implements OnInit {

  public form: UntypedFormGroup;
  public supplementForm: UntypedFormGroup;
  public supplementType = false;
  @ViewChild('stepper') stepper: any;
  supplementSelected = [];
  loadingSearch = false;
  supplementArray: any;
  // supplementArray: any;

  pathToRedirect: any;
  isSmallDevice = false;
  paramsToUrlRedirect: any;
  _unsubscribeAll: Subject<any>;
  imageUrl: any = environment.imageUrl;

  signArray: SignArray[] = [
    {
      name: 'Positivos',
      sign: [
        {value: '+0.00', viewValue: '+0.00'},
        {value: '+0.25', viewValue: '+0.25'},
        {value: '+0.50', viewValue: '+0.50'},
        {value: '+0.75', viewValue: '+0.75'},
        {value: '+1.00', viewValue: '+1.00'},
        {value: '+1.25', viewValue: '+1.25'},
        {value: '+1.50', viewValue: '+1.50'},
        {value: '+1.75', viewValue: '+1.75'},
        {value: '+2.00', viewValue: '+2.00'},
        {value: '+2.25', viewValue: '+2.25'},
        {value: '+2.50', viewValue: '+2.50'},
        {value: '+2.75', viewValue: '+2.75'},
        {value: '+3.00', viewValue: '+3.00'},
        {value: '+3.25', viewValue: '+3.25'},
        {value: '+3.50', viewValue: '+3.50'},
        {value: '+3.75', viewValue: '+3.75'},
        {value: '+4.00', viewValue: '+4.00'},
        {value: '+4.25', viewValue: '+4.25'},
        {value: '+4.50', viewValue: '+4.50'},
        {value: '+4.75', viewValue: '+4.75'},
        {value: '+5.00', viewValue: '+5.00'},
        {value: '+5.25', viewValue: '+5.25'},
        {value: '+5.50', viewValue: '+5.50'},
        {value: '+5.75', viewValue: '+5.75'},
        {value: '+6.00', viewValue: '+6.00'},
        {value: '+6.25', viewValue: '+6.25'},
        {value: '+6.50', viewValue: '+6.50'},
        {value: '+6.75', viewValue: '+6.75'},
        {value: '+7.00', viewValue: '+7.00'},
        {value: '+7.25', viewValue: '+7.25'},
        {value: '+7.50', viewValue: '+7.50'},
        {value: '+7.75', viewValue: '+7.75'},
        {value: '+8.00', viewValue: '+8.00'},
        {value: '+8.25', viewValue: '+8.25'},
        {value: '+8.50', viewValue: '+8.50'},
        {value: '+8.75', viewValue: '+8.75'},
        {value: '+9.00', viewValue: '+9.00'},
      ],
    },
    {
      name: 'Negativos',
      sign: [
        {value: '-0.00', viewValue: '-0.00'},
        {value: '-0.25', viewValue: '-0.25'},
        {value: '-0.50', viewValue: '-0.50'},
        {value: '-0.75', viewValue: '-0.75'},
        {value: '-1.00', viewValue: '-1.00'},
        {value: '-1.25', viewValue: '-1.25'},
        {value: '-1.50', viewValue: '-1.50'},
        {value: '-1.75', viewValue: '-1.75'},
        {value: '-2.00', viewValue: '-2.00'},
        {value: '-2.25', viewValue: '-2.25'},
        {value: '-2.50', viewValue: '-2.50'},
        {value: '-2.75', viewValue: '-2.75'},
        {value: '-3.00', viewValue: '-3.00'},
        {value: '-3.25', viewValue: '-3.25'},
        {value: '-3.50', viewValue: '-3.50'},
        {value: '-3.75', viewValue: '-3.75'},
        {value: '-4.00', viewValue: '-4.00'},
        {value: '-4.25', viewValue: '-4.25'},
        {value: '-4.50', viewValue: '-4.50'},
        {value: '-4.75', viewValue: '-4.75'},
        {value: '-5.00', viewValue: '-5.00'},
        {value: '-5.25', viewValue: '-5.25'},
        {value: '-5.50', viewValue: '-5.50'},
        {value: '-5.75', viewValue: '-5.75'},
        {value: '-6.00', viewValue: '-6.00'},
        {value: '-6.25', viewValue: '-6.25'},
        {value: '-6.50', viewValue: '-6.50'},
        {value: '-6.75', viewValue: '-6.75'},
        {value: '-7.00', viewValue: '-7.00'},
        {value: '-7.25', viewValue: '-7.25'},
        {value: '-7.50', viewValue: '-7.50'},
        {value: '-7.75', viewValue: '-7.75'},
        {value: '-8.00', viewValue: '-8.00'},
        {value: '-8.25', viewValue: '-8.25'},
        {value: '-8.50', viewValue: '-8.50'},
        {value: '-8.75', viewValue: '-8.75'},
        {value: '-9.00', viewValue: '-9.00'},
        {value: '-9.25', viewValue: '-9.25'},
        {value: '-9.50', viewValue: '-9.50'},
        {value: '-9.75', viewValue: '-9.75'},
        {value: '-10.00', viewValue: '-10.00'},
        {value: '-10.25', viewValue: '-10.25'},
        {value: '-10.50', viewValue: '-10.50'},
        {value: '-10.75', viewValue: '-10.75'},
        {value: '-11.00', viewValue: '-11.00'},
        {value: '-11.25', viewValue: '-11.25'},
        {value: '-11.50', viewValue: '-11.50'},
        {value: '-11.75', viewValue: '-11.75'},
        {value: '-12.00', viewValue: '-12.00'},
        {value: '-12.25', viewValue: '-12.25'},
        {value: '-12.50', viewValue: '-12.50'},
        {value: '-12.75', viewValue: '-12.75'},
        {value: '-13.00', viewValue: '-13.00'},
        {value: '-13.25', viewValue: '-13.25'},
        {value: '-13.50', viewValue: '-13.50'},
        {value: '-13.75', viewValue: '-13.75'},
        {value: '-14.00', viewValue: '-14.00'},
      ],
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogPrescriptionComponent>,
    private fb: FormBuilder,
    public productsService: ProductService,
    private cartService: CartService,
    private spinner: NgxSpinnerService,
    public loggedInUserService: LoggedInUserService,
    public translateService: TranslateService,
    private route: ActivatedRoute,
    public utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.createForm();
    this.pathToRedirect = this.route.snapshot?.routeConfig?.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
    });
    this.supplementForm.get('supplementType').valueChanges.subscribe(item => {
      if (item) {
        // this.stepper.next();
      }
      if (this.supplementForm.get('supplementType').value?.RecomendedProduct?.name?.es.includes('Progresivos') ||
        this.supplementForm.get('supplementType').value?.RecomendedProduct?.name?.es.includes('Bifocales')) {
        this.form.get('add').setValidators(Validators.required);
        console.log(this.form);
        console.log('entro aki');
      } else {
        this.form.get('add').setValidators(null);
      }
    });
    this.breakpointObserver
      .observe([
        Breakpoints.Medium,
        Breakpoints.Handset,
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Tablet
      ])
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.isSmallDevice = data.matches;
      });

  }

  ngOnInit(): void {
    // this.form.get('cylinderLeft').valueChanges.subscribe(item => {
    //   console.log(item);
    //   if (item) {
    //     console.log('entro');
    //     this.form.get('axisLeft').setValidators(Validators.required);
    //   } else {
    //     this.form.get('axisLeft').setValidators(null);
    //   }
    // });
    // this.form.get('cylinderRight').valueChanges.subscribe(item => {
    //   if (item) {
    //     console.log('entro');
    //     this.form.get('axisRight').setValidators(Validators.required);
    //   } else {
    //     this.form.get('axisRight').setValidators(null);
    //   }
    // });

    this.supplementForm.get('supplementType').valueChanges.subscribe(item => {
      if (item) {
        this.stepper.next();
      }
      if (this.supplementForm.get('supplementType').value?.RecomendedProduct?.name?.es.includes('Progresivos') ||
        this.supplementForm.get('supplementType').value?.RecomendedProduct?.name?.es.includes('Bifocales')) {
        this.form.get('add').setValidators(Validators.required);
        console.log(this.form);
        console.log('entro aki');
      } else {
        this.form.get('add').setValidators(null);
      }
    });

    this.loadingSearch = true;
    this.productsService.getNewRecomendedProduct(this.data.product.id, 'supplement').subscribe({
      next: (data) => {
        this.loadingSearch = false;
        this.supplementArray = data.data;

        this.supplementArray.forEach(item => {
          item.Recomendeds.forEach(item2 => {
            item2.checked = false;
          });
        });
        this.supplementArray.forEach(item => {
          item.forEach(item2 => {
            item2.seeDetails = false;
          });
        });
      },
      error: (err) => {
        this.dialogRef.close(false);
      }
    });
  }

  selectEye(element) {
    console.log(element);
  }

  createForm() {
    this.form = this.fb.group({
      left: ['+0.00', [Validators.required]],
      cylinderLeft: [null],
      axisLeft: [null],
      right: ['+0.00', [Validators.required]],
      cylinderRight: [null, []],
      axisRight: [null, []],
      pupillaryDistance: [null, []],
      add: [null, []],
      prescriptionImageUrl: [null],
      prescriptionImageName: [null]
    });
    this.supplementForm = this.fb.group({
      supplementType: [null, [Validators.required]],
      supplementFilter: [null, []],
      supplementColor: [null, []],
      supplementDye: [null, []],
    });
  }

  // ///// UPLOAD DATA SHEET
  onUploadDataSheet() {
    let dialogRef: MatDialogRef<DialogUploadMediaComponent, any>;
    dialogRef = this.dialog.open(DialogUploadMediaComponent, {
      panelClass: 'app-dialog-upload-media',
      width: this.isSmallDevice ? '60vw' : '90%',
      maxWidth: this.isSmallDevice ? '100vw' : '100vw',
      height: this.isSmallDevice ? '50vh' : '50%',
      maxHeight: this.isSmallDevice ? '70vh' : '100vh',
      data: {
        type: 'prescriptionImage'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.form.get('prescriptionImageUrl').setValue(result.url.prescriptionUrl);
        this.form.get('prescriptionImageName').setValue(result.url.prescriptionName);
      }
    });
  }

  onChangeSelection(event: any, positionArrayFather: number, positionArrayChild: number, stepper?: any) {
    // this.supplementArray[positionArrayFather].Recomendeds[positionArrayChild].checked = true;

    console.log(positionArrayFather);
    console.log(positionArrayChild);

    this.supplementArray[positionArrayFather].Recomendeds.forEach(item => {

        if (item.RecomendedProduct.name.es !== this.supplementArray[positionArrayFather].Recomendeds[positionArrayChild].RecomendedProduct.name.es) {
          item.checked = false;
        } else {
          if (positionArrayFather === 0) {
            this.supplementForm.get('supplementType').setValue(item);

            console.log(item.RecomendedProduct.name.es.includes('Progresivos'));
            console.log(item.RecomendedProduct.name.es.includes('Bifocales'));
            console.log(item);

            if (this.supplementForm.get('supplementType').value?.RecomendedProduct?.name?.es.includes('Progresivos') ||
                this.supplementForm.get('supplementType').value?.RecomendedProduct?.name?.es.includes('Bifocales')) {
              this.form.get('add').setValidators(Validators.required);
            } else {
              this.form.get('add').setValidators([]);
            }
            console.log(this.form);
          } else if (positionArrayFather === 1) {
            this.supplementForm.get('supplementFilter').setValue(item);
            this.supplementForm.get('supplementDye').setValue(null);
            this.supplementArray[3].Recomendeds.forEach( item2 => { item2.checked = false; });
          } else if (positionArrayFather === 2) {
            this.supplementForm.get('supplementColor').setValue(item);
            this.supplementForm.get('supplementDye').setValue(null);
            this.supplementArray[3].Recomendeds.forEach( item2 => { item2.checked = false; });
          } else if (positionArrayFather === 3) {
            this.supplementForm.get('supplementDye').setValue(item);
            this.supplementForm.get('supplementColor').setValue(null);
            this.supplementForm.get('supplementFilter').setValue(null);
            this.supplementArray[1].Recomendeds.forEach( item2 => { item2.checked = false; });
            this.supplementArray[2].Recomendeds.forEach( item2 => { item2.checked = false; });
          }
          item.checked = true;
        }
    });
    // if (!this.supplementForm.get('supplementType').value) {
    //   this.supplementArray[1].Recomendeds.forEach( item => { item.checked = false; });
    //   this.supplementForm.get('supplementFilter').setValue(null);
    //   this.supplementForm.get('supplementColor').setValue(null);
    //   this.supplementForm.get('supplementDye').setValue(null);
    // }
    console.log(this.supplementForm.value);
  }

  buyNow() {
    this.spinner.show();
    this.loadingSearch = true;
    let supplements: any[] = [];

    if (this.supplementForm.get('supplementType').value && this.form.value) {
      supplements.push(this.supplementForm.get('supplementType').value.RecomendedProduct.Stocks[0].uuid);
      if (this.supplementForm.get('supplementDye').value) {
        supplements.push(this.supplementForm.get('supplementDye').value.RecomendedProduct.Stocks[0].uuid);
      }
      if (this.supplementForm.get('supplementColor').value) {
        supplements.push(this.supplementForm.get('supplementColor').value.RecomendedProduct.Stocks[0].uuid);
      }
      if (this.supplementForm.get('supplementFilter').value) {
        supplements.push(this.supplementForm.get('supplementFilter').value.RecomendedProduct.Stocks[0].uuid);
      }
      console.log(supplements);
      let dataToSend = {
        StockId: this.data.product.Stock.id,
        ProductId: this.data.product.Stock.id,
        supplementIds: supplements,
        prescription: this.form.value
      };

      if (this.loggedInUserService.getLoggedInUser()) {
        this.cartService.addToCart(this.data.product,
          Math.max(this.data.product.minSale, this.data.quantity),
          true,
          dataToSend.supplementIds,
          dataToSend.prescription).then((carts: Cart[]) => {
          this.loadingSearch = false;
          this.dialogRef.close(true);
          console.log(carts);
          for (let cart of carts) {
            let dataFind = cart.CartItems.find((cartItemx) => cartItemx?.ProductId == this.data.product.id);
            if (dataFind != undefined) {
              let cartId = cart?.id;
              let BusinessId = cart.BusinessId;
              let cartIds = cart?.CartItems ? cart?.CartItems.map((i) => i.id) : cart.CartItems.map((i) => i.id);
              console.log(cartIds);
              this.router.navigate(['/checkout'], { queryParams: { cartId, cartIds, BusinessId } }).then();
              return;
            }
          }
        });
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }

}

  save() {
    this.spinner.show();
    this.loadingSearch = true;
    let supplements: any[] = [];

    if (this.supplementForm.get('supplementType').value && this.form.value) {
      supplements.push(this.supplementForm.get('supplementType').value.RecomendedProduct.Stocks[0].uuid);
      if (this.supplementForm.get('supplementDye').value) {
        supplements.push(this.supplementForm.get('supplementDye').value.RecomendedProduct.Stocks[0].uuid);
      }
      if (this.supplementForm.get('supplementColor').value) {
        supplements.push(this.supplementForm.get('supplementColor').value.RecomendedProduct.Stocks[0].uuid);
      }
      if (this.supplementForm.get('supplementFilter').value) {
        supplements.push(this.supplementForm.get('supplementFilter').value.RecomendedProduct.Stocks[0].uuid);
      }
      console.log(supplements);
      let dataToSend = {
        StockId: this.data.product.Stock.id,
        ProductId: this.data.product.Stock.id,
        supplementIds: supplements,
        prescription: this.form.value
      };

      if (this.loggedInUserService.getLoggedInUser()) {
        if (this.data.quantity === 0) {
          return false;
        }
        this.cartService.addToCart(this.data.product,
          Math.max(this.data.product.minSale, this.data.quantity),
          false,
          dataToSend.supplementIds,
          dataToSend.prescription).then();
        this.loadingSearch = false;
        this.dialogRef.close(true);
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    } else if (!this.supplementForm.get('supplement').value && this.form.value) {
      let dataToSend = {
        StockId: this.data.product.Stock.id,
        ProductId: this.data.product.Stock.id,
        supplementIds: this.supplementForm.get('supplement').value.map(item => item.RecomendedProduct.Stocks[0].uuid),
        prescription: this.form.value
      };

      if (this.loggedInUserService.getLoggedInUser()) {
        if (this.data.quantity === 0) {
          return false;
        }
        this.cartService.addToCart(this.data.product,
          Math.max(this.data.product.minSale, this.data.quantity),
          false,
          dataToSend.supplementIds,
          dataToSend.prescription).then();
        this.loadingSearch = false;
        this.dialogRef.close(true);

      } else {
        this.loadingSearch = false;
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    }

    // console.log(dataToSend);
  }

  closeWithoutPrescription() {
    this.spinner.show();
    let supplements: any[] = [];

    console.log(this.supplementForm.get('supplementType').value);

    if (this.supplementForm.get('supplementType').value) {
      supplements.push(this.supplementForm.get('supplementType').value.RecomendedProduct.Stocks[0].uuid);
      if (this.supplementForm.get('supplementDye').value) {
        supplements.push(this.supplementForm.get('supplementDye').value.RecomendedProduct.Stocks[0].uuid);
      }
      let dataToSend = {
        StockId: this.data.product.Stock.id,
        ProductId: this.data.product.Stock.id,
        supplementIds: supplements
      };
      console.log(supplements);

      if (this.loggedInUserService.getLoggedInUser()) {
        if (this.data.quantity === 0) {
          return false;
        }
        this.cartService.addToCart(this.data.product,
          Math.max(this.data.product.minSale, this.data.quantity),
          false,
          dataToSend.supplementIds).then();
        this.dialogRef.close(true);
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    }

    this.dialogRef.close(true);
    console.log('closeWithoutPrescription');
  }

  close() {
    this.dialogRef.close();
    console.log('close');
  }

}
