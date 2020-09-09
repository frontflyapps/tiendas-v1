import {
  Component,
  Inject,
  HostListener,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user/user.service';
import { ShowSnackbarService } from './../../../../core/services/show-snackbar/show-snackbar.service';
import { environment } from './../../../../../environments/environment';
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from './../../../../core/services/utils/utils.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { TaxesShippingService } from '../../services/taxes-shipping/taxes-shipping.service';
import { RegionsService } from '../../services/regions/regions.service';
import { ProductService } from '../../../shared/services/product.service';
import { IPagination } from './../../../../core/classes/pagination.class';

@Component({
  selector: 'app-dialog-add-edit-taxes',
  templateUrl: './dialog-add-edit-taxes.component.html',
  styleUrls: ['./dialog-add-edit-taxes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditTaxesComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedTax: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  Regions: any[] = [];
  Products: any[] = [];
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  /////////////////////////////////////////////////////
  queryCountries: IPagination = {
    limit: 10,
    total: 0,
    offset: 0,
    order: 'createdAt',
    page: 1,
    filter: { filterText: '', properties: [] },
  };

  allCountries: any[] = [];

  displayFn(user?: any): string | undefined {
    return user ? user.name.es : undefined;
  }

  ////////////////////////////////////////////////////

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditTaxesComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private productService: ProductService,
    private regionService: RegionsService,
    private taxesShippingService: TaxesShippingService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedTax = data.selectedTax;
    console.log('TCL: DialogAddEditTaxesComponent ->  this.selectedTax', this.selectedTax);
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = 'es';
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
    this.productService.getAllProducts({ limit: 0, offset: 0 }).subscribe(
      (data) => {
        this.Products = data.data;
        if (!this.isEditing) {
          this.form.controls['ProductIds'].setValue(
            this.Products.map((item) => {
              return item.id;
            }),
          );
        }
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );

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

    if (!this.isEditing) {
      this.form.controls.applyForAllCountries.valueChanges.subscribe((value) => {
        if (value) {
          this.form.controls.CountryId.clearValidators();
          this.form.controls.CountryId.updateValueAndValidity();
          this.form.controls.CountryId.disable();
        } else {
          this.form.controls.CountryId.setValidators([Validators.required]);
          this.form.controls.CountryId.updateValueAndValidity();
          this.form.controls.CountryId.enable();
        }
      });
    }
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        name: [
          this.selectedTax && this.selectedTax.name ? this.selectedTax.name[this.language] : null,
          [Validators.required],
        ],
        description: [
          this.selectedTax && this.selectedTax.description ? this.selectedTax.description[this.language] : null,
          [Validators.required],
        ],
        CountryId: [
          this.selectedTax && this.selectedTax.CountryId ? this.selectedTax.Country : null,
          [Validators.required, this.selectItemValidator],
        ],
        ProductIds: [this.selectedTax && this.selectedTax.ProductId ? [this.selectedTax.ProductId] : null, []],
        price: [this.selectedTax && this.selectedTax.price ? this.selectedTax.price : 0.0, [Validators.required]],
      });
    } else {
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        description: [null, [Validators.required]],
        CountryId: [null, [Validators.required, this.selectItemValidator]],
        ProductIds: [null, []],
        price: [0.0, [Validators.required]],
        applyForAllCountries: [false, []],
      });
    }

    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });
    //////////////////////////////////////////////
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = this.form.value;
    if (!data.applyForAllCountries) {
      data.CountryId = data.CountryId.id;
    }

    if (!this.isEditing) {
      data = this.parseLanguaje(data, this.language);
      this.taxesShippingService.createTax(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Tax successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Tax', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data = this.parseLanguajeEdit(data, this.selectedTax, this.language);
      data.id = this.selectedTax.id;

      this.taxesShippingService.editTax(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Tax created successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Tax', 'Editing');
          this.spinner.hide();
        },
      );
    }
  }

  ////////////////////////////UTILS FOR LANGUAGE HANDLE///////////////////////////////////////
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  parseLanguaje(data, lang) {
    data.name = { [lang]: data.name };
    data.description = { [lang]: data.description };
    return data;
  }

  parseLanguajeEdit(data, oldData, lang) {
    oldData.name[lang] = data.name;
    oldData.description[lang] = data.description;
    data.name = oldData.name;
    data.description = oldData.description;
    return data;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////

  getCountries() {
    this.regionService.getAllCountries(this.queryCountries).subscribe(
      (data) => {
        this.allCountries = data.data;
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  selectItemValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && !control.value.id) {
      return { notSelectedItem: true };
    }

    return null;
  }
}
