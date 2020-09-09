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
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user/user.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { environment } from './../../../../../../environments/environment';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { RegionsService } from '../../../services/regions/regions.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IPagination } from './../../../../../core/classes/pagination.class';
@Component({
  selector: 'app-dialog-add-edit-regions',
  templateUrl: './dialog-add-edit-regions.component.html',
  styleUrls: ['./dialog-add-edit-regions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditRegionsComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedRegion: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  TypeRegions: any[] = ['Continent', 'Country', 'State', 'City', 'Neighboorhood'];
  Regions: any[] = [];

  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  /////////////////////////////////////////////////////
  countryCtrl = new FormControl();
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
  displayFn(user?: any): string | undefined {
    return user ? user.name['es'] : undefined;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditRegionsComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private regionsService: RegionsService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedRegion = data.selectedRegion;
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // --------------------------------------------------------------------------------------------------
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
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });
    ///////////////////////////////////////////////////////////////////////////////////
    this.form.controls.CountryId.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((val) => {
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
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        name: [this.selectedRegion.name, [Validators.required]],
        CountryId: [this.selectedRegion.Country, [Validators.required, this.autocompleteValidator]],
        lat: [this.selectedRegion.lat, []],
        lng: [this.selectedRegion.lng, []],
      });
      this.form.controls.CountryId.disable();
    } else {
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        CountryId: [null, [Validators.required, this.autocompleteValidator]],
        lat: [null, []],
        lng: [null, []],
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = this.form.value;

    if (!this.isEditing) {
      data.alpha2 = data.CountryId.alpha2;
      data.CountryId = data.CountryId.id;
      this.regionsService.createCity(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Region successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Region', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data.id = this.selectedRegion.id;
      delete data.CountryId;
      this.regionsService.editCity(data).subscribe(
        (newProfile) => {
          this.showSnackbar.showSucces(this.translate.instant('Region updated successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Region', 'Editing');
          this.spinner.hide();
        },
      );
    }
  }

  ////////////////////////////UTILS FOR LANGUAGE HANDLE///////////////////////////////////////
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  autocompleteValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control || !control.value || !control.value.id) {
      return { InvalidValue: true };
    }
    return null;
  }

  parseLanguaje(data, lang) {
    data.name = { [lang]: data.name };
    data.description = { [lang]: data.description };
    return data;
  }

  parseLanguajeEdit(data, olData, lang) {
    olData.name[lang] = data.name;
    olData.description[lang] = data.description;
    data.name = olData.name;
    data.description = olData.description;
    return data;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////

  getCountries() {
    this.regionsService.getAllCountries(this.queryCountries).subscribe(
      (data) => {
        this.allCountries = data.data;
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }
}
