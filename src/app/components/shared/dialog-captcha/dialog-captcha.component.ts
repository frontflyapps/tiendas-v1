import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CaptchaService } from '../../../core/services/captcha/captcha.service';
import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogCaptchaModule } from './dialog-captcha.module';
import { LocalStorageService } from '../../../core/services/localStorage/localStorage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-captcha',
  templateUrl: './dialog-captcha.component.html',
  styleUrls: ['./dialog-captcha.component.scss']
})
export class DialogCaptchaComponent implements OnInit {

  form: UntypedFormGroup;
  data: any;
  pathToRedirect: any;
  inLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    public captchaService: CaptchaService,
    public showToastr: ShowToastrService,
    public utilsService: UtilsService,
    public translateService: TranslateService,
    public localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    private router: Router,
    private cartService: CartService
  ) {
    // this.data = this.localStorageService.getFromStorage('captcha');
    console.log(this.data);
    this.pathToRedirect = this.route.snapshot.queryParams.url;
    console.log(this.pathToRedirect);
    this.refreshData();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      value: [null, [Validators.required]],
      hash: [this.data ? this.data?.hash : null, [Validators.required]],
    });
  }

  refreshData() {
    console.log(this.data);
    const dataToSend = {
      uuid: this.data?.uuid,
      hash: this.data?.hash,
    };
    this.inLoading = true;
    this.captchaService.getCaptcha(dataToSend).subscribe(item => {
        this.inLoading = false;
        this.data = item;
        console.log(item);
        // this.localStorageService.setOnStorage('captcha', item);
        // this.data = this.localStorageService.getFromStorage('captcha');
    },
      error => {
        this.inLoading = false;
        console.log(error);
        this.utilsService.errorHandle(error);
      });
  }

  sendData() {

    const dataToSend = {
      uuid: this.data?.uuid,
      hash: this.data?.hash,
      answer: this.form.get('value').value
    };
    this.inLoading = true;

    this.captchaService.confirmCaptcha(dataToSend).subscribe(item => {
        this.showToastr.showSucces('Captcha correcto');
        this.inLoading = true;
      if (this.cartService.dataAddToCart) {
        this.cartService.addToCart(this.cartService.dataAddToCart.product,
                                   this.cartService.dataAddToCart.quantity,
                                   this.cartService.dataAddToCart.goToPay,
                                   this.cartService.dataAddToCart.supplementIds,
                                   this.cartService.dataAddToCart.prescription).then( item => {
                                     this.router.navigate(['cart']);
                                     this.inLoading = false;
                                     this.cartService.dataAddToCart = null;
        });
      } else if (this.pathToRedirect.includes(['payment'])) {
        console.log('entro aki');
        console.log(this.pathToRedirect);
        this.router.navigate([this.pathToRedirect]);
      } else {
        this.inLoading = false;
        this.router.navigate(['']);
      }
        this.inLoading = false;
    },
      error => {
        console.log(error);
        this.inLoading = false;
        this.data = error.error;
        // this.localStorageService.setOnStorage('captcha', error.error);
        // this.data = this.localStorageService.getFromStorage('captcha');
        this.showToastr.showError(error.error.title);
        // this.utilsService.errorHandle(error);
      }
    );
    console.log('sendData');
  }

}
