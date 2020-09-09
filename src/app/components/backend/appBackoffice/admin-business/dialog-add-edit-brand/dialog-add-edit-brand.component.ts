import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { environment } from 'src/environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/core/services/utils/utils.service';

import { CategoriesService } from '../../../../services/categories/catagories.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-add-edit-brand',
  templateUrl: './dialog-add-edit-brand.component.html',
  styleUrls: ['./dialog-add-edit-brand.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditBrandComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  selectedBrand: any;
  loadImage = false;
  showErrorImage = false;
  urlImage = 'url(data:image/jpeg;base64,';
  base64textString = null;
  imageBrand = null;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  imageBrandChange = false;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditBrandComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private showToastr: ShowToastrService,
    private categoriesService: CategoriesService,
  ) {
    this.urlImage = environment.apiUrl;
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedBrand = data.selectedBrand;
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
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        name: [this.selectedBrand && this.selectedBrand.name ? this.selectedBrand.name : null, [Validators.required]],
        description: [this.selectedBrand && this.selectedBrand.description ? this.selectedBrand.description : null],
        model: [this.selectedBrand && this.selectedBrand.model ? this.selectedBrand.model : null],
      });
      if (this.selectedBrand.image) {
        this.base64textString = this.selectedBrand.image;
        this.imageBrand = this.urlImage + this.base64textString;
        this.loadImage = true;
      }
    } else {
      this.form = this.fb.group({
        name: [null, [Validators.required]],
        description: [null],
        model: [null],
      });
    }

    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });
    //////////////////////////////////////////////
  }

  //////////////////////////
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  //////////////////////////////////////////

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
    this.imageBrand = this.urlImage + this.base64textString;
    this.loadImage = true;
    this.showErrorImage = false;
    this.imageBrandChange = true;
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  //////////////////////////////////////////

  onSave(): void {
    let data = this.form.value;
    this.spinner.show();

    if (this.imageBrandChange) {
      data.image = this.imageBrand;
    }

    if (!this.isEditing) {
      this.categoriesService.createBrand(data).subscribe(
        () => {
          this.showToastr.showSucces('Brand successfully created');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Brand', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data.id = this.selectedBrand.id;
      console.log(data);
      this.categoriesService.editBrand(data).subscribe(
        () => {
          this.showToastr.showSucces('Updated brand successfully');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Brand', 'Editing');
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
    data.model = { [lang]: data.model };
    data.description = { [lang]: data.description };
    return data;
  }

  parseLanguajeEdit(data, oldData, lang) {
    oldData.name[lang] = data.name;
    oldData.description[lang] = data.description;
    oldData.model[lang] = data.model;
    data.name = oldData.name;
    data.description = oldData.description;
    data.model = oldData.model;
    return data;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
