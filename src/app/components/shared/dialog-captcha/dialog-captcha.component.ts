import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CaptchaService } from '../../../core/services/captcha/captcha.service';
import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogCaptchaModule } from './dialog-captcha.module';
import { LocalStorageService } from '../../../core/services/localStorage/localStorage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dialog-captcha',
  templateUrl: './dialog-captcha.component.html',
  styleUrls: ['./dialog-captcha.component.scss']
})
export class DialogCaptchaComponent implements OnInit {

  form: UntypedFormGroup;
  data: any;
  pathToRedirect: any;

  constructor(
    private fb: UntypedFormBuilder,
    public captchaService: CaptchaService,
    public showToastr: ShowToastrService,
    public utilsService: UtilsService,
    public translateService: TranslateService,
    public localStorageService: LocalStorageService,
    private route: ActivatedRoute,
  ) {
    this.data = this.localStorageService.getFromStorage('captcha');
    console.log(this.data);
    this.pathToRedirect = this.route.snapshot;
    console.log(this.pathToRedirect);
    // this.refreshData();
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
    this.captchaService.getCaptcha(dataToSend).subscribe(item => {
        console.log(item);
        this.localStorageService.setOnStorage('captcha', item);
        this.data = this.localStorageService.getFromStorage('captcha');
    },
      error => {
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

    this.captchaService.confirmCaptcha(dataToSend).subscribe(item => {
      this.showToastr.showSucces("Captcha correcto");
    },
      error => {
        console.log(error);
        this.localStorageService.setOnStorage('captcha', error.error);
        this.data = this.localStorageService.getFromStorage('captcha');
        this.showToastr.showError(error.error.title);
        // this.utilsService.errorHandle(error);
      }
    );
    console.log('sendData');
  }

}
