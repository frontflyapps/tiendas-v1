import { RegionsService } from './../../../../services/regions/regions.service';
import { IUser, IMessenger } from '../../../../../../core/classes/user.class';
import {
  Component,
  Inject,
  HostListener,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName } from '@angular/forms';
import { ShowToastrService } from './../../../../../../core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from './../../../../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../../../../environments/environment';
import { ShowSnackbarService } from './../../../../../../core/services/show-snackbar/show-snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from './../../../../../../core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './../../../../services/user/user.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IPagination } from './../../../../../../core/classes/pagination.class';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-dialog-add-edit-mesenger',
  templateUrl: './dialog-add-edit-mesenger.component.html',
  styleUrls: ['./dialog-add-edit-mesenger.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditMessengerComponent implements OnInit {
  isSaving = false;
  isEditing = false;
  loggedInUser: IUser;
  selectedMessenger: IMessenger;
  loadImage = false;
  imageAvatarChange = false;
  showErrorImage = false;
  urlImage = 'data:image/jpeg;base64,';
  base64textString = null;
  imageAvatar = null;
  innerWidth: any;
  applyStyle = false;
  passwordType = 'password';
  form: FormGroup;
  formPass: FormGroup;
  isChangePass = false;
  role: any;
  Roles: any[] = ['Admin', 'Messenger', 'Collaborator', 'Client'];
  ////////////////////////////////////////////////////

  queryCountries: IPagination = {
    limit: 10,
    total: 0,
    offset: 0,
    order: '-name',
    page: 1,
    filter: { filterText: '', properties: [] },
  };

  allCountries: any[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  countryCtrl = new FormControl();
  filteredFruits: Observable<any>;
  allContriesAutocomplete: any[] = [];
  selectedCountries: any[] = [];
  localDatabaseUsers = environment.localDatabaseUsers;

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ////////////////////////////////////////////////////

  queryAllCountries: IPagination = {
    limit: 10,
    total: 0,
    offset: 0,
    order: '-name',
    page: 1,
    filter: { filterText: '', properties: [] },
  };
  languages: { name: string; image: string; lang: string }[];
  language: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditMessengerComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private userService: UserService,
    private regionService: RegionsService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.urlImage = environment.apiUrl;
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.isEditing = data.isEditing;
    this.role = data.role;
    this.selectedMessenger = data.selectedMessenger;
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 600) {
      this.applyStyle = false;
    } else {
      this.applyStyle = true;
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.form.controls['CountryId'].valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((val) => {
      if (val && val.length !== 0) {
        if (val.toString().trim() !== '') {
          this.queryCountries.filter = {
            filterText: val.toString().trim(),
            properties: ['filter[$or][name][$like]', 'filter[$or][ioc][$like]'],
          };
          this.getCountries();
        }
      } else {
        this.queryCountries = {
          limit: 10,
          total: 0,
          offset: 0,
          order: 'name',
          page: 1,
          filter: { filterText: '' },
        };
        this.getCountries();
      }
    });

    this.countryCtrl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((val) => {
      if (val && val.length !== 0) {
        if (val.toString().trim() !== '') {
          this.queryAllCountries.filter = {
            filterText: val.toString().trim(),
            properties: ['filter[$or][name][$like]', 'filter[$or][ioc][$like]'],
          };
          this.getCountriesChiplist();
        }
      } else {
        this.queryAllCountries = {
          limit: 10,
          total: 0,
          offset: 0,
          order: 'name',
          page: 1,
          filter: { filterText: '' },
        };
        this.getCountriesChiplist();
      }
    });
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        name: [
          this.selectedMessenger && this.selectedMessenger.Person ? this.selectedMessenger.Person.name : null,
          [Validators.required],
        ],
        lastName: [
          this.selectedMessenger && this.selectedMessenger.Person.lastName
            ? this.selectedMessenger.Person.lastName
            : null,
          [Validators.required],
        ],
        username: [
          this.selectedMessenger && this.selectedMessenger.Person ? this.selectedMessenger.Person.username : null,
          [Validators.required],
        ],
        address: [this.selectedMessenger && this.selectedMessenger.address ? this.selectedMessenger.address : null, []],
        city: [this.selectedMessenger && this.selectedMessenger.city ? this.selectedMessenger.city : null, []],
        CountryId: [
          this.selectedMessenger && this.selectedMessenger.CountryId ? this.selectedMessenger.Country : null,
          [],
        ],
        phone: [this.selectedMessenger && this.selectedMessenger.phone ? this.selectedMessenger.phone : null, []],
        email: [
          this.selectedMessenger && this.selectedMessenger.Person.email ? this.selectedMessenger.Person.email : null,
          [Validators.required, Validators.email],
        ],
        dni: [
          this.selectedMessenger && this.selectedMessenger.dni ? this.selectedMessenger.dni : null,
          [Validators.required],
        ],
        description: [
          this.selectedMessenger && this.selectedMessenger.description ? this.selectedMessenger.description : null,
        ],
        roles: [[this.role], [Validators.required]],
        CountryIds: [
          this.selectedMessenger.Countries.map((item) => {
            return item.id;
          }),
          [Validators.required, Validators.minLength(1)],
        ],
      });
      this.selectedCountries = [...this.selectedMessenger.Countries];
      if (this.selectedMessenger.avatar) {
        this.base64textString = this.selectedMessenger.avatar;
        this.imageAvatar = this.urlImage + this.base64textString;
        this.loadImage = true;
      }
    } else {
      this.isChangePass = true;
      this.formPass = this.fb.group(
        {
          password: [null, [Validators.required]],
          repeat: [null, [Validators.required]],
        },
        { validator: this.matchValidator.bind(this) },
      );
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        username: [null, [Validators.required]],
        dni: [null, [Validators.required]],
        address: [null, []],
        phone: [null, []],
        email: [null, [Validators.required, Validators.email]],
        password: this.formPass,
        description: [null],
        roles: [[this.role], [Validators.required]],
        city: [null, []],
        CountryId: [null, []],
        CountryIds: [[], [Validators.required, Validators.minLength(1)]],
      });
      if (!this.localDatabaseUsers) {
        this.form.get('username').disable();
        this.form.updateValueAndValidity();
      }
    }
  }

  ngOnDestroy(): void {}

  onSelectSliderChange(event) {
    if (this.isChangePass) {
      this.isChangePass = false;
      this.form.removeControl('password');
    } else {
      this.isChangePass = true;
      this.formPass = this.fb.group(
        {
          password: [null, [Validators.required]],
          repeat: [null, [Validators.required]],
        },
        { validator: this.matchValidator.bind(this) },
      );
      this.form.addControl('password', this.formPass);
    }
    this.form.updateValueAndValidity();
  }

  matchValidator(group: FormGroup) {
    const pass = group.controls['password'].value;
    const repeat = group.controls['repeat'].value;
    if (pass === repeat && pass && repeat && pass !== '') {
      return null;
    }
    return {
      mismatch: true,
    };
  }

  /////////////////////////////////////

  // kike
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files[0].size < 500000) {
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorImage = true;
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.urlImage = 'data:image/jpeg;base64,';
    this.imageAvatar = this.urlImage + this.base64textString;
    this.loadImage = true;
    this.showErrorImage = false;
    this.imageAvatarChange = true;
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  //////////////////////////////////////////

  onUpdateProfile(): void {
    this.spinner.show();
    const data = this.form.value;
    if (this.imageAvatarChange) {
      data.avatar = this.imageAvatar;
    }
    data.CountryId = data.CountryId.id;

    if (!this.localDatabaseUsers) {
      data.username = data.email;
    }

    if (!this.isEditing) {
      data.password = this.formPass.value.password;
      console.log(data, 'Data del mensajero');
      this.userService.createMEssenger(data).subscribe(
        (newProfile) => {
          this.showSnackbar.showSucces(this.translate.instant('Messenger successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'User', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data.id = this.selectedMessenger.id;
      if (this.isChangePass) {
        data.password = this.formPass.value.password;
      }
      this.userService.editMEssenger(data).subscribe(
        (newProfile) => {
          if (newProfile.id === this.loggedInUser.id) {
            this.loggedInUserService.setNewProfile(newProfile.data);
          }
          this.showSnackbar.showSucces(this.translate.instant('Messenger updated successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'User', 'Editing');
          this.spinner.hide();
        },
      );
    }
  }

  getCountries() {
    this.regionService.getAllCountries(this.queryCountries).subscribe(
      (data) => {
        this.allCountries = [...data.data];
        console.log('TCL: DialogAddEditMessengerComponent -> getCountries -> this.allCountries', this.allCountries);
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  getCountriesChiplist() {
    this.regionService.getAllCountries(this.queryAllCountries).subscribe(
      (data) => {
        this.allContriesAutocomplete = [...data.data];
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  //////////////////////////////////////////////////////////////////////////
  displayFn(country?: any): string | undefined {
    if (country != undefined) {
      return country.name['es'];
    } else {
      return undefined;
    }
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.selectedCountries.push(value.trim());
        this.form.controls['CountryIds'].setValue(
          this.selectedCountries.map((item) => {
            return item.id;
          }),
        );
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.countryCtrl.setValue(null);
    }
  }

  remove(country: any): void {
    const index = this.selectedCountries.indexOf(country);

    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
    }
    this.form.controls['CountryIds'].setValue(
      this.selectedCountries.map((item) => {
        return item.id;
      }),
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCountries.push(event.option.value);
    this.form.controls['CountryIds'].setValue(
      this.selectedCountries.map((item) => {
        return item.id;
      }),
    );
    this.fruitInput.nativeElement.value = '';
    this.countryCtrl.setValue(null);
  }
}
