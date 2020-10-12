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
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BiconService } from '../../../services/bicon/bicon.service';
import { IconsDb } from '../classes/icons';
import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { CompressImageService } from './../../../../../core/services/image/compress-image.service';

@Component({
  selector: 'app-dialog-edit-bicon',
  templateUrl: './dialog-edit-bicon.component.html',
  styleUrls: ['./dialog-edit-bicon.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogEditBiconComponent implements OnInit, OnDestroy {
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
  selectedBicon = null;
  arrayIcons: any[] = [];
  filteredIcons: any[] = [];

  showErrorImage = false;
  urlImage = 'url(data:image/jpeg;base64,';
  base64textString = null;
  imageCarrusel = null;
  compressImageCarrusel = null;
  imageCarruselChange = false;
  loadImage = false;
  selectedIcon = null;
  currentIndex = 20;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogEditBiconComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private translate: TranslateService,
    private biconService: BiconService,
    private compressImage: CompressImageService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedBicon = data.selectedBicon;
    console.log('TCL: DialogEditBannersComponent -> selectedBicon', this.selectedBicon);
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

    this.arrayIcons = IconsDb.icons;
    this.filteredIcons = this.arrayIcons.slice(0, 20);
    //////////////////////////////////////////////

    this.form.controls.icon.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((data) => {
      this.onSearhIcons(data);
    });

    if (this.selectedBicon && this.selectedBicon.icon) {
      this.form.controls.icon.setValue(this.selectedBicon.icon);
      this.selectedIcon = this.selectedBicon.icon + '';
    }
  }

  createForm(): void {
    if (this.isEditing) {
      this.form = this.fb.group({
        title: [
          this.selectedBicon && this.selectedBicon.title ? this.selectedBicon.title[this.language] : null,
          [Validators.required],
        ],
        subTitle: [
          this.selectedBicon && this.selectedBicon.subTitle ? this.selectedBicon.subTitle[this.language] : null,
          [],
        ],
        icon: [this.selectedBicon && this.selectedBicon.icon ? this.selectedBicon.icon : null, [Validators.required]],
      });
      if (this.selectedBicon.image) {
        this.base64textString = this.selectedBicon.image;
        this.imageCarrusel = this.imageUrl + this.base64textString;
        this.loadImage = true;
      }
    } else {
      this.form = this.fb.group({
        title: [null, [Validators.required]],
        subTitle: [null, []],
        icon: [null, [Validators.required]],
      });
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onSave(): void {
    this.spinner.show();
    let data = this.form.value;

    if (this.imageCarruselChange) {
      data.image = this.imageCarrusel;
    }

    if (!this.isEditing) {
      data = this.parseLanguaje(data, this.language);
      this.biconService.createBicon(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Bicon successfully created'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Bicon', 'Creating');
          this.spinner.hide();
        },
      );
    } else {
      data = this.parseLanguajeEdit(data, this.selectedBicon, this.language);
      data.id = this.selectedBicon.id;
      console.log(data);
      this.biconService.editBicon(data).subscribe(
        () => {
          this.showSnackbar.showSucces(this.translate.instant('Updated bicon successfully'));
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          console.log(error);
          this.utilsService.errorHandle(error, 'Bicon', 'Editing');
          this.spinner.hide();
        },
      );
    }
  }

  onSelectedIcon(icon) {
    this.selectedIcon = icon + '';
    this.form.controls.icon.setValue(icon);
  }

  onSearhIcons(searchValue) {
    this.currentIndex = 0;
    let temp = this.arrayIcons.filter((item: string) => item.indexOf(searchValue, 0) >= 0);
    this.filteredIcons = temp.length >= 50 ? temp.slice(0, 50) : temp;
  }

  onLoadMoreIcons() {
    let temp = this.arrayIcons.slice(
      this.currentIndex,
      Math.min(this.currentIndex + 20, this.arrayIcons.length - this.currentIndex),
    );
    // console.log("TCL: DialogEditBiconComponent -> onLoadMoreIcons -> temp", temp)
    this.currentIndex += temp.length;
    // console.log("TCL: DialogEditBiconComponent -> onLoadMoreIcons -> currentIndex", this.currentIndex)
    this.filteredIcons = this.filteredIcons.concat(temp);
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
