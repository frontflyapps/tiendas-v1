import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMAIL_REGEX } from '../../../core/classes/regex.const';
import { TranslateService } from '@ngx-translate/core';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import * as moment from 'moment';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyContactsComponent } from '../../main/my-contacts/my-contacts.component';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RegionsService } from '../../../core/services/regions/regions.service';
import { CartService } from '../../shared/services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-receiver-form',
  templateUrl: './receiver-form.component.html',
  styleUrls: ['./receiver-form.component.scss'],
})
export class ReceiverFormComponent implements OnInit, OnDestroy {
  loadingPayment: boolean;
  CI_Length = 11;
  form: FormGroup;
  customFields: any;
  fields: any;
  language: any;
  onlyCubanPeople = true;
  allCountries: any[] = [];
  allProvinces: any[] = [];
  allProvinces$: Observable<any>;
  allMunicipalities: any[] = [];
  municipalities: any[] = [];
  loggedInUser: any;
  defaultContact: any;
  _unsubscribeAll: Subject<any>;
  productToRequest: string;

  minDate = moment()
    .add(3, 'd') //replace 2 with number of days you want to add
    .toDate(); //convert it to a Javascript Date Object if you like
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

  constructor(
    private fb: FormBuilder,
    public contactsService: ContactsService,
    public utilsService: UtilsService,
    public loggedInUserService: LoggedInUserService,
    private regionService: RegionsService,
    private cartService: CartService,
    private router: ActivatedRoute,
    private route: Router,
    private showToastr: ShowToastrService,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) {
    this.router.queryParams.subscribe((data) => {
      this.productToRequest = data.productId;
    });

    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.setObsContact();
    this.getContacts();
    this.fetchCountriesAndMunicipalities();
    this.buildForm();
  }

  ngOnInit(): void {}

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
      // city: [null, [Validators.required]],
      // regionProvinceState: [null, [Validators.required]],
      CountryId: [59, [Validators.required]],
      ProvinceId: [null, [Validators.required]],
      MunicipalityId: [null, [Validators.required]],
      isForCuban: [true, [Validators.required]],
      dni: [null, [Validators.required, Validators.minLength(this.CI_Length), Validators.maxLength(this.CI_Length)]],
      email: [null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      phone: [null, []],
      info: [null, []],
      paymentType: [],
      currency: [],
    });
  }

  private fetchCountriesAndMunicipalities() {
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

  onAddContact() {
    let dialogRef: MatDialogRef<MyContactsComponent, any>;
    dialogRef = this.dialog.open(MyContactsComponent, {
      panelClass: 'app-my-contacts',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '40rem',
      data: {},
    });
  }

  setObsContact() {
    this.contactsService.allContacts$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
      this.contactsService.allContacts = response.data;
      this.defaultContact = response.data.filter((item) => item.selected);
      // Fill form with default contact
      if (this.defaultContact.length) {
        this.form.patchValue(this.defaultContact[0]);
        this.form.get('dni').setValue(this.defaultContact[0]?.identification);
        this.form.markAllAsTouched();
        console.log(this.form);
      }
    });
  }

  getContacts() {
    this.contactsService.getContact.next('');
  }

  async onGoToPayment() {
    let body = {
      ...this.form.value,
      ProductId: this.productToRequest,
      message: '',
    };
    this.cartService.postBuyRequest(body).subscribe({
      next: (data) => {
        if (data) {
          this.showToastr.showSucces('Se le enviara un correo electrónico', 'Solicitud creada correctamente', 8000);
          this.route.navigate(['']).then();
        }
      },
      error: (error) => {
        this.utilsService.errorHandle(error);
      },
    });
  }

  isRequiredField(field: string) {
    const response = this.fields.filter((item) => item.name === field && item.required);
    if (response.length) {
      return true;
    } else {
      return;
    }
  }

  public compareById(val1, val2) {
    return val1 && val2 && val1 == val2;
  }

  onSelectProvince(provinceId) {
    setTimeout(() => {
      this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
      this.form.get('MunicipalityId').setValue(null);
      this.form.get('ShippingBusinessId').setValue(null);
    }, 0);
  }

  onSelectContact(contact) {
    this.form.get('name').setValue(contact?.name);
    this.form.get('lastName').setValue(contact?.lastName);
    this.form.get('email').setValue(contact?.email);
    this.form.get('CountryId').setValue(59);
    this.form.get('ProvinceId').setValue(contact?.ProvinceId);
    this.form.get('MunicipalityId').setValue(contact?.MunicipalityId);
    this.form.get('address').get('street').setValue(contact?.address.street);
    this.form.get('address').get('number').setValue(contact?.address.number);
    this.form.get('address').get('between').setValue(contact?.address.between);
    this.form.get('dni').setValue(contact?.identification);
    this.form.get('phone').setValue(contact?.phone);

    this.form.markAllAsTouched();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
