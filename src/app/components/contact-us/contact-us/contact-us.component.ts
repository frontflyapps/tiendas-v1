import { MetaService } from './../../../core/services/meta.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  form: FormGroup;
  loggedUser: any;
  apiUrl = environment.apiUrl;
  constructor(
    private loggedUserServ: LoggedInUserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private http: HttpClient,
    private metaService: MetaService,
  ) {
    this.loggedUser = this.loggedUserServ.getLoggedInUser();
    this.metaService.setMeta(
      'Contáctenos',
      environment.meta?.mainPage?.description,
      environment.meta?.mainPage?.shareImg,
      environment.meta?.mainPage?.keywords,
    );
  }

  ngOnInit(): void {
    console.log(this.loggedUser);
    this.form = this.fb.group({
      name: [this.loggedUser?.name, [Validators.required]],
      phone: [this.loggedUser?.phone, [Validators.pattern(/^(\+|[0-9])([0-9]{5,})([0-9])$/)]],
      email: [this.loggedUser?.email, [Validators.required, Validators.email]],
      topic: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }
  onSend() {
    let value = this.form.value;
    // console.log('🚀 ~ file: contact-us.component.ts ~ line 41 ~ ContactUsComponent ~ onSend ~ value', value);
    this.spinner.show();
    this._createContactMail(value).subscribe(
      () => {
        this.showToastr.showSucces('Su correo se ha enviado correctamente', 'Éxitos', 6000);
        this.form.get('topic').reset();
        this.form.get('message').reset();
        this.spinner.hide();
      },
      (error) => {
        // console.log('🚀 ~ file: contact-us.component.ts ~ line 51 ~ ContactUsComponent ~ onSend ~ error', error);
        if (error.status == 401) {
          this.showToastr.showInfo('Usted debe estar logeado para realizar esta acción', 'Éxitos', 6000);
        }
        this.spinner.hide();
      },
    );
  }
  private _createContactMail(data): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'contact-us', data);
  }
}
