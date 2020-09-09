import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { CompressImageService } from './../../../../../core/services/image/compress-image.service';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
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
import { BannersService } from '../../../services/banners/banners.service';

@Component({
  selector: 'app-dialog-edit-banners',
  templateUrl: './dialog-edit-banners.component.html',
  styleUrls: ['./dialog-edit-banners.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogEditBannersComponent implements OnInit, OnDestroy {
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
  selectedBanner = null;

  showErrorImage = false;
  urlImage: string = 'data:type/example;base64,';
  base64textString = null;
  imageBanner = null;
  compressImageBanner = null;
  imageBannerChange = false;
  loadImage = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEditBannersComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private bannersService: BannersService,
    private compressImage: CompressImageService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedBanner = data.selectedBanner;
    console.log('TCL: DialogEditBannersComponent -> selectedBanner', this.selectedBanner);
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
          this.selectedBanner && this.selectedBanner.title ? this.selectedBanner.title[this.language] : null,
          [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required],
        ],
        text: [
          this.selectedBanner && this.selectedBanner.text ? this.selectedBanner.text[this.language] : null,
          [Validators.maxLength(100)],
        ],
        link: [
          this.selectedBanner.link,
          [
            Validators.pattern(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            ),
          ],
        ],
      });
      if (this.selectedBanner.image) {
        this.base64textString = this.selectedBanner.image;
        this.imageBanner = this.imageUrl + this.base64textString;
        this.loadImage = true;
      }
    } else {
      this.form = this.fb.group({
        title: [null, [Validators.minLength(5), Validators.pattern(/^\w((?!\s{2}).)*/), Validators.required]],
        text: [null, [Validators.maxLength(100)]],
        link: [
          null,
          [
            Validators.pattern(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
            ),
          ],
        ],
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // kike
  handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];
    ///data:type/example;base64,
    this.urlImage = `data:${file.type};base64,`;
    if (files[0].size < 2000000) {
      if (files && file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    } else {
      this.showErrorImage = true;
    }
  }

  async handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.imageBanner = this.urlImage + this.base64textString;
    try {
      this.compressImageBanner = this.imageBanner;
      this.imageBanner = this.compressImageBanner;
      this.loadImage = true;
      this.showErrorImage = false;
      this.imageBannerChange = true;
    } catch (error) {
      this.loadImage = true;
      this.showErrorImage = false;
      this.imageBannerChange = true;
    }
  }

  openFileBrowser(event) {
    event.preventDefault();

    const element: HTMLElement = document.getElementById('filePicker') as HTMLElement;
    element.click();
  }

  //////////////////////////////////////////

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    let data = this.form.value;

    if (this.imageBannerChange) {
      data.image = this.imageBanner;
    }

    if (!this.isEditing) {
      data = this.parseLanguaje(data, this.language);
      this.bannersService.createBanner(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Banner successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Banner', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data = this.parseLanguajeEdit(data, this.selectedBanner, this.language);
      data.id = this.selectedBanner.id;
      console.log(data);
      this.bannersService.editBanner(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Updated banner successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Banner', 'Editing');
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
    data.text = { [lang]: data.text };
    return data;
  }

  parseLanguajeEdit(data, oldData, lang) {
    oldData.title[lang] = data.title;
    oldData.text[lang] = data.text;
    data.title = oldData.title;
    data.text = oldData.text;
    return data;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
