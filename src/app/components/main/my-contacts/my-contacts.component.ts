import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from '../../../core/services/show-snackbar/show-snackbar.service';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { RegionsService } from '../../../core/services/regions/regions.service';
import { LocalStorageService } from '../../../core/services/localStorage/localStorage.service';
import { LOCATION_DATA } from '../../../core/classes/global.const';
import { environment } from '../../../../environments/environment';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.component.html',
  styleUrls: ['./my-contacts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyContactsComponent implements OnInit, OnDestroy {
  innerWidth: any;
  applyStyle = false;
  loggedInUser: any;
  form: FormGroup;

  isLoading = false;

  _unsubscribeAll: Subject<any> = new Subject();

  allProvinces: any[] = [];
  allMunicipalities: any[] = [];
  municipalities: any[] = [];

  onCreateContact = false;
  isEditing = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MyContactsComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private authService: AuthenticationService,
    private translate: TranslateService,
    private showSnackbar: ShowSnackbarService,
    private regionService: RegionsService,
    private localStorageService: LocalStorageService,
    public contactsService: ContactsService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  ngOnInit(): void {
    this.createForm();

    this.setObsContact();
    this.getContacts();

    this.getProvinceMunicipalityFromLocal();
  }

  setObsContact() {
    this.contactsService.allContacts$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
          this.contactsService.allContacts = response.data;
          this.isLoading = false;
        },
        () => this.isLoading = false,
      );
  }

  getContacts() {
    this.isLoading = true;
    this.contactsService.getContact.next();
  }

  getProvinceMunicipalityFromLocal() {
    const locationData = this.localStorageService.getFromStorage(LOCATION_DATA);

    if (this.localStorageService.iMostReSearch(locationData?.timespan, environment.timeToResetSession)) {
      this.getProvinceMunicipality();
    } else {
      this.setProvincesFromResponse(locationData.allProvinces);
      this.setMunicipalitiesFromResponse(locationData.allMunicipalities);
    }
  }

  getProvinceMunicipality() {
    this.regionService.getProvinces().subscribe((data) => {
      // this.allProvinces = data.data;
      this.setProvincesFromResponse(data.data);
    });
    this.regionService.getMunicipalities().subscribe((data) => {
      this.setMunicipalitiesFromResponse(data.data);
      // this.allMunicipalities = data.data;
      // this.municipalities = this.allMunicipalities.filter(
      //   (item) => item.ProvinceId == this.form.get('ProvinceId').value,
      // );

      const locationData = {
        allProvinces: this.allProvinces,
        allMunicipalities: this.allMunicipalities,
        timespan: new Date().getTime(),
      };
      this.localStorageService.setOnStorage(LOCATION_DATA, locationData);
    });
  }

  setProvincesFromResponse(res) {
    this.allProvinces = res;
  }

  setMunicipalitiesFromResponse(res) {
    this.allMunicipalities = res;
    this.municipalities = this.allMunicipalities.filter(
      (item) => item.ProvinceId == this.form.get('ProvinceId').value,
    );
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [null],

      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],

      email: [null, [Validators.required, Validators.email]],
      identification: [null, [Validators.required]],

      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],

      MunicipalityId: [null, [Validators.required]],
      ProvinceId: [null, [Validators.required]],
    });

    this.form.markAllAsTouched();
  }

  fillFormByContact(contact) {
    this.form.get('id').setValue(contact?.id || null);
    this.form.get('name').setValue(contact?.name || null);
    this.form.get('lastName').setValue(contact?.lastName || null);
    this.form.get('email').setValue(contact?.email || null);
    this.form.get('identification').setValue(contact?.identification || null);
    this.form.get('phone').setValue(contact?.phone || null);
    this.form.get('address').setValue(contact?.address || null);
    this.form.get('MunicipalityId').setValue(contact?.MunicipalityId || null);
    this.form.get('ProvinceId').setValue(contact?.ProvinceId || null);
  }

  onCreateContactFn() {
    this.createForm();
    this.onCreateContact = true;
    this.isEditing = false;
  }

  onSetUpdateContact(): void {
    const data = JSON.parse(JSON.stringify(this.form.value));

    if (this.isEditing) {
      this.setEditingContact(data);
      return;
    }

    if (!this.isEditing) {
      delete data.id;
      this.setCreateContact(data);
      return;
    }

  }

  setCreateContact(data) {
    this.contactsService.create(data)
      .subscribe((contactRes) => {

        this.contactsService.allContacts.push({ ...contactRes.data });

        this.onCreateContact = false;

      });
  }

  setEditingContact(data) {
    this.contactsService.edit(data)
      .subscribe((contactRes) => {

        const idx = this.contactsService.allContacts.findIndex((item) => item.id === data.id);

        if (idx >= 0) {
          this.contactsService.allContacts[idx] = { ...contactRes.data };
        }

        this.onCreateContact = false;
      });
  }

  onSetBack() {
    this.createForm();
    this.onCreateContact = false;
  }

  public compareById(val1, val2) {
    return val1 && val2 && val1 == val2;
  }

  editContact(contact) {
    this.isEditing = true;

    this.createForm();
    this.fillFormByContact(contact);

    this.onCreateContact = true;
  }

  removeContact(contact) {
    this.contactsService.remove(contact).then(() => {
      const indexC = this.contactsService.allContacts.findIndex(item => item.id == contact.id);
      this.contactsService.allContacts.splice(indexC, 1);
    });
  }

  onSelectProvince(provinceId) {
    this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    this.form.get('MunicipalityId').setValue(null);
  }

  ngOnDestroy() {
    if (this._unsubscribeAll) {
      this._unsubscribeAll.next(true);
      this._unsubscribeAll.complete();
      this._unsubscribeAll.unsubscribe();
    }
  }
}
