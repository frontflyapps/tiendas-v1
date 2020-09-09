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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../../../../../../environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CarruselService } from '../../../services/carrusel/carrusel.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { CompressImageService } from './../../../../../core/services/image/compress-image.service';
import { ImagePickerConf } from 'ngp-image-picker';

@Component({
  selector: 'app-dialog-edit-carrusels',
  templateUrl: './dialog-edit-carrusels.component.html',
  styleUrls: ['./dialog-edit-carrusels.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogEditCarruselsComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  innerWidth: any;
  applyStyle = false;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  selectedCarrusel = null;

  imageCarrusel = null;
  imageCarruselChange = false;
  imageCarruselXs = null;
  imageCarruselXsChange = false;

  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '180px',
  };
  imagePickerConfXs: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '120px',
  };

  colorTitle = '#24303E';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEditCarruselsComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private carruselService: CarruselService,
    private compressImage: CompressImageService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedCarrusel = data.selectedCarrusel;
    console.log('TCL: DialogEditBannersComponent -> selectedCarrusel', this.selectedCarrusel);
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(
      this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage() : this.languages[0],
    );
    // -------------------------------------------------------------------------------------------------
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
    console.log(this.form);
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });
    //////////////////////////////////////////////
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        title: [
          this.selectedCarrusel && this.selectedCarrusel.title ? this.selectedCarrusel.title[this.language] : null,
          [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required],
        ],
        subTitle: [
          this.selectedCarrusel && this.selectedCarrusel.subTitle
            ? this.selectedCarrusel.subTitle[this.language]
            : null,
          [Validators.maxLength(200)],
        ],
        link: [
          this.selectedCarrusel.link,
          [
            Validators.pattern(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            ),
          ],
        ],
      });
      this.imageCarrusel = this.selectedCarrusel.image;
      this.imageCarruselXs = this.selectedCarrusel.imageXs;
    } else {
      this.form = this.fb.group({
        title: [null, [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required]],
        subTitle: [null, [Validators.maxLength(200)]],
        link: [
          null,
          [
            Validators.pattern(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            ),
          ],
        ],
      });

      this.colorTitle = this.selectedCarrusel.colorTitle;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onImageChange(dataUri) {
    this.imageCarruselChange = true;
    this.imageCarrusel = dataUri;
  }

  onImageChangeXs(dataUri): void {
    this.imageCarruselXsChange = true;
    this.imageCarruselXs = dataUri;
  }

  //////////////////////////////////////////

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = this.form.value;
    data.colorTitle = this.colorTitle;

    if (this.imageCarruselChange) {
      data.image = this.imageCarrusel;
    }
    if (this.imageCarruselXsChange) {
      data.imageXs = this.imageCarruselXs;
    }

    if (!this.isEditing) {
      data = this.parseLanguaje(data, this.language);
      this.carruselService.createCarrusel(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Carrusel successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Carrusel', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data = this.parseLanguajeEdit(data, this.selectedCarrusel, this.language);
      data.id = this.selectedCarrusel.id;
      console.log(data);
      this.carruselService.editCarrusel(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Updated carrusel successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Carrusel', 'Editing');
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
    data.title = { [lang]: data.title };
    data.subTitle = { [lang]: data.subTitle };
    return data;
  }

  parseLanguajeEdit(data, oldData, lang) {
    oldData.title[lang] = data.title;
    oldData.subTitle[lang] = data.subTitle;
    data.title = oldData.title;
    data.subTitle = oldData.subTitle;
    return data;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
