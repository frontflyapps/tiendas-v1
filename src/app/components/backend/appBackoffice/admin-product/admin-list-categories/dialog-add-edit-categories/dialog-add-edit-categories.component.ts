import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupName } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../../../../services/categories/catagories.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilsService } from './../../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../../core/services/show-snackbar/show-snackbar.service';
import { CompressImageService } from './../../../../../../core/services/image/compress-image.service';

@Component({
  selector: 'app-dialog-add-edit-categories',
  templateUrl: './dialog-add-edit-categories.component.html',
  styleUrls: ['./dialog-add-edit-categories.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditCategoriesComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedCategory: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  Categories: any[] = [];

  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  ParentCategoryId = undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditCategoriesComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private categoriesService: CategoriesService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    console.log('DialogAddEditCategoriesComponent -> data', data);
    this.selectedCategory = data.selectedCategory;
    this.ParentCategoryId = data.ParentCategoryId;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // ---------
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
    this.categoriesService.getAllCategories({ limit: 0, offset: 0 }).subscribe(
      (data) => {
        this.Categories = data.data;
        if (!this.isEditing) {
          if (this.ParentCategoryId) {
            this.Categories = this.Categories.filter((item) => item.id == this.ParentCategoryId);
          } else {
            this.Categories = [];
          }
        }
      },
      (error) => {},
    );
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        name: [
          this.selectedCategory && this.selectedCategory.name ? this.selectedCategory.name[this.language] : null,
          [Validators.minLength(3), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required],
        ],
        showInNavBar: [this.selectedCategory.showInNavBar],
        ParentCategoryId: [
          this.selectedCategory && this.selectedCategory.ParentCategoryId
            ? this.selectedCategory.ParentCategoryId
            : null,
        ],
      });
    } else {
      this.form = this.fb.group({
        name: [null, [Validators.minLength(3), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required]],
        showInNavBar: [true, []],
        ParentCategoryId: [this.ParentCategoryId, []],
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
    if (!data.ParentCategoryId) {
      delete data.ParentCategoryId;
    }

    if (!this.isEditing) {
      data = this.parseLanguaje(data, this.language);
      this.categoriesService.createCategory(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Category successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Category', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data = this.parseLanguajeEdit(data, this.selectedCategory, this.language);
      data.id = this.selectedCategory.id;
      console.log(data);
      this.categoriesService.editCategory(data).subscribe(
        (newProfile) => {
          this.showSnackbar.showSucces(this.translate.instant('Category updated successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Category', 'Editing');
          this.spinner.hide();
        },
      );
    }
  }

  ////////////////////////////UTILS FOR LANGUAGE HANDLE///////////////////////////////////////
  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.lang === f2.lang;
  }

  compareBy(f1: any, f2: any) {
    return f1 && f2 && f1 == f2;
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
}
