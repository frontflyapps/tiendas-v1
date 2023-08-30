import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';
import { ShowSnackbarService } from '../../../core/services/show-snackbar/show-snackbar.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { environment } from '../../../../environments/environment';
import { UploadTypesEnum } from '../file-upload/upload-types.enum';

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

  /////////////////////////////////////////////////////
  countryCtrl = new FormControl();
  url = '';
  uuid = '';
  FileId = null;
  isUploaded = false;

  ////////////////////////////////////////////////////
  product: any = {};
  newFile: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogUploadMediaComponent>,
    private loggedInUserService: LoggedInUserService,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    // private uploadFilesService: UploadFilesService,
    private showSnackbar: ShowSnackbarService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this.loggedInUser.token = this.loggedInUserService.getTokenCookie();
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

    this.product = data.product;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  ngOnInit(): void {
    // ////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.language = data.lang;
    });
    // /////////////////////////////////////////////////////////////////////////////////
    // this.uploadFilesService.$uploadFileEnd.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
    //   if (!this.isUploaded) {
    //     let dataOutput = data.body.data;
    //     this.url = dataOutput.url;
    //     this.dialogRef.close({ url: this.url });
    //   }
    // });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next('');
    this._unsubscribeAll.complete();
  }

  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
  }

  onNewFileLoaded(event) {
    console.log('event returned 222', event);
    this.newFile = event;
  }

  onSaveMedia(event) {
    this.url = event.url + '';
    this.uuid = event.uuid + '';
    this.FileId = event.FileId;
    this.showSnackbar.showSucces(
      `Su video ha comenzado el proceso de subida, espere a que este completado el proceso para continuar con la creación o edición
      del mismo.`,
      8000,
    );
    // this.uploadFilesService.emitUploadStart(event);
    // let timeout = setTimeout(() => {
    //   this.uploadFilesService
    //     .getUrlFile(this.uuid, this.FileId)
    //     .toPromise()
    //     .then((result: any) => {
    //       this.url = result?.data?.url || '';
    //       if (this.url) {
    //         this.isUploaded = true;
    //         this.dialogRef.close({ url: this.url });
    //       }
    //       clearTimeout(timeout);
    //     });
    // }, 1000);
  }

  fileUploadDone() {
    this.dialogRef.close(this.newFile);
  }
  public get uploadType(): typeof UploadTypesEnum {
    return UploadTypesEnum;
  }

  onSelectMedia(event) {
    this.url = event.url || '';
    this.dialogRef.close({ url: this.url });
    this.dialogRef.close(event);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////
}
