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
import { FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowSnackbarService } from '../../../../../core/services/show-snackbar/show-snackbar.service';
import { environment } from '../../../../../../environments/environment';
import { LoggedInUserService } from '../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from '../../../../../core/services/show-toastr/show-toastr.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPagination } from '../../../../../core/classes/pagination.class';
import { UploadFilesService } from 'src/app/core/services/upload-service/upload-file.service';
import { timeStamp } from 'console';
@Component({
  selector: 'app-dialog-upload-media',
  templateUrl: './dialog-upload-media.component.html',
  styleUrls: ['./dialog-upload-media.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogUploadMediaComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  innerWidth: any;
  applyStyle = false;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  loggedInUser: any;
  language: any;
  _unsubscribeAll: Subject<any>;
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;
  apiUrlRepositoy = environment.apiUrlRepositoy;

  /////////////////////////////////////////////////////
  countryCtrl = new FormControl();
  ////////////////////////////////////////////////////

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogUploadMediaComponent>,
    private loggedInUserService: LoggedInUserService,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private uploadFilesService: UploadFilesService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
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
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });
    ///////////////////////////////////////////////////////////////////////////////////
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
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

  parseLanguajeEdit(data, olData, lang) {
    olData.name[lang] = data.name;
    olData.description[lang] = data.description;
    data.name = olData.name;
    data.description = olData.description;
    return data;
  }

  onSaveMedia(event) {
    let data = event && event.constructor == Object ? JSON.parse(JSON.stringify(event)) : undefined;
    this.uploadFilesService.emitUploadStart(event);
    this.showSnackbar.showSucces(
      `Su video ha comenzado el proceso de descarga, puede continuar con la creación del producto. Por favor no cierre el navegadar ni  salga de la vsta de administración. \n
    En caso de algun tipo de error en la subida de un archivo le notificaremos.`,
      8000,
    );
    setTimeout(() => {
      this.uploadFilesService
        .getUrlFile(data.uuid, data.FileId)
        .toPromise()
        .then((data) => {
          this.dialogRef.close(data.data);
        });
    }, 250);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
}
