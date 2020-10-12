import { OffertService } from './../../services/offert/offert.service';
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
import { ShowSnackbarService } from '../../../../core/services/show-snackbar/show-snackbar.service';
import { environment } from '../../../../../environments/environment';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from '../../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { TaxesShippingService } from '../../services/taxes-shipping/taxes-shipping.service';
import { RegionsService } from '../../services/regions/regions.service';
import { ProductService } from '../../../shared/services/product.service';
import { IPagination } from '../../../../core/classes/pagination.class';
import { CategoriesService } from '../../services/categories/catagories.service';

@Component({
  selector: 'app-dialog-add-edit-offert-category',
  templateUrl: './dialog-add-edit-offert-category.component.html',
  styleUrls: ['./dialog-add-edit-offert-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditOffertCategoryComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedTax: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  allCategories: any[] = [];
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  removable = true;
  selectable = true;

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
  minDate1 = new Date();

  ////////////////////////////////////////////////////

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditOffertCategoryComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private categoriaService: CategoriesService,
    private showSnackbar: ShowSnackbarService,
    private offertService: OffertService,
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
    this.categoriaService.getAllCategories().subscribe((data) => {
      this.allCategories = data.data;
      this.allCategories = this.allCategories.sort(function (a, b) {
        return a.name['es'] > b.name['es'] ? 1 : a.name['es'] < b.name['es'] ? -1 : 0;
      });
    });
  }

  createForm(): void {
    if (this.isEditing) {
    } else {
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        CategoryIds: [null, [Validators.required]],
        value: [0.0, [Validators.required]],
        isPercent: [false],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  removeCategory(category) {
    let value = this.form.get('CategoryIds').value;
    value = value.filter((item) => item.id != category.id);
    this.form.get('CategoryIds').setValue(value);
  }

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = { ...this.form.value };
    data.CategoryIds = data.CategoryIds.map((item) => item.id);
    data.startDate = data.startDate.toISOString();
    data.endDate = data.endDate.toISOString();

    if (!this.isEditing) {
      console.log(data);
      this.offertService.createOffert(data).subscribe(
        (data) => {
          this.spinner.hide();
          this.dialogRef.close(data.data);
        },
        () => {
          this.spinner.hide();
        },
      );
    } else {
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

  selectItemValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && !control.value.id) {
      return { notSelectedItem: true };
    }

    return null;
  }
}
