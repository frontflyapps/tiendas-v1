import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../shared/services/product.service';
import { environment } from '../../../../../environments/environment';
import { CartService } from '../../../shared/services/cart.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

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
  supplementSelected: any[] = [];
  loadingSearch: boolean = false;
  supplementArray: any;

  pathToRedirect: any;
  paramsToUrlRedirect: any;
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
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.createForm();
    this.pathToRedirect = this.route.snapshot?.routeConfig?.path;
    this.route.queryParamMap.subscribe((params) => {
      this.paramsToUrlRedirect = { ...params };
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
    this.loadingSearch = true;
    this.productsService.getNewRecomendedProduct(this.data.product.id, 'supplement').subscribe((data: any) => {
      this.loadingSearch = false;
      this.supplementArray = data.data;
      console.log(this.supplementArray);
    //   // this.loadingRelated = false;
    //   //   const timeOut = setTimeout(() => {
    //   //     this.loadingRelated = false;
    //   //     clearTimeout(timeOut);
    //   //   }, 800);
    });
  }

  selectEye(element) {
    console.log(element);
  }

  createForm() {
    this.form = this.fb.group({
      left: [null, [Validators.required]],
      cylinderLeft: [null],
      axisLeft: [null],
      right: [null, [Validators.required]],
      cylinderRight: [null],
      axisRight: [null],
      pupillaryDistance: [null],
    });
    this.supplementForm = this.fb.group({
      supplement: [null, [Validators.required]],
    });
  }

  onChangeSelection(event: any, position: number) {
    this.supplementSelected[position] = event.value;
    this.supplementForm.get('supplement').setValue(this.supplementSelected);
  }

  buyWithoutGlass() {
    this.spinner.show();
    // if (this.supplementForm.get('supplement').value && this.form.value) {

      if (this.loggedInUserService.getLoggedInUser()) {
        if (this.data.quantity === 0) {
          return false;
        }
        this.cartService.addToCart(this.data.product,
          Math.max(this.data.product.minSale, this.data.quantity),
          false).then();
        this.dialogRef.close(true);
      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    // }
  }

  save() {
    this.spinner.show();
    let supplements: any[] = [];

    if (this.supplementForm.get('supplement').value && this.form.value) {
      this.supplementForm.get('supplement').value.map(item => {
        console.log(item);
        if (item) {
          supplements.push(item.RecomendedProduct.Stocks[0].uuid);
        }
        console.log(supplements);
      });
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
        this.dialogRef.close(true);

      } else {
        this.cartService.redirectToLoginWithOrigin(this.pathToRedirect, this.paramsToUrlRedirect);
      }
    }

    // console.log(dataToSend);
  }

  closeWithoutPrescription() {
    this.spinner.show();
    let supplements: any[] = [];

    if (this.supplementForm.get('supplement').value) {
      this.supplementForm.get('supplement').value.map(item => {
        console.log(item);
        if (item) {
          supplements.push(item.RecomendedProduct.Stocks[0].uuid);
        }
        console.log(supplements);
      });
      let dataToSend = {
        StockId: this.data.product.Stock.id,
        ProductId: this.data.product.Stock.id,
        supplementIds: supplements
      };

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
