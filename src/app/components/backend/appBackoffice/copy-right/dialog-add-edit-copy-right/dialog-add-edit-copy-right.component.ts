import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { Component, Inject, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ImagePickerConf } from 'ngp-image-picker';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';

import * as Editor from 'src/assets/js/ckeditor/build/ckeditor';
import { cdkEditorBasicConfig } from 'src/app/core/classes/cdkeditor-full-config';
import { CopyRightService } from '../../../services/copy-right/copy-right.service';

@Component({
  selector: 'app-dialog-add-edit-copy-right',
  templateUrl: './dialog-add-edit-copy-right.component.html',
  styleUrls: ['./dialog-add-edit-copy-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogAddEditCopyRightComponent implements OnInit, OnDestroy {
  isSaving = false;
  isEditing = false;
  loggedInUser: any;
  form: FormGroup;
  languages: any[] = [];
  imageUrl: any;
  languageForm: FormControl;
  language: any;
  _unsubscribeAll: Subject<any>;
  selectedCopyRight = null;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '120px',
    width: '160px',
  };

  allStatus: any[] = ['enabled', 'pending', 'cancelled'];
  public Editor = Editor;
  config = cdkEditorBasicConfig;
  /////////////////////////////////////////////////
  languageData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddEditCopyRightComponent>,
    private loggedInUserService: LoggedInUserService,
    private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private copyRightService: CopyRightService,

    private showToastr: ShowToastrService,
  ) {
    this.dialogRef.disableClose = true;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    this._unsubscribeAll = new Subject<any>();

    this.isEditing = data.isEditing;
    this.selectedCopyRight = data.selectedCopyRight;
    this.imageUrl = environment.imageUrl;

    // ------------------LANGUAGE INITIALIZATION----------------
    this.languages = this.loggedInUserService.getlaguages();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.languageForm = new FormControl(this.language);
    // -------------------------------------------------------------------------------------------------
  }

  ngOnInit(): void {
    this.createForm();
    //////////////////EVENT ASSOCIATED WITH CHANGE LANGUAGE////////////////////////////
    this.languageForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.updateLanguageData();
      this.language = data;
      this.form.get('text').setValue(this.languageData.text[this.language] || '');
    });
    //////////////////////////////////////////////
    this.fetchData();
  }

  createForm(): void {
    this.form = this.fb.group({
      text: [this.selectedCopyRight?.text[this.language], []],
      status: [this.selectedCopyRight?.status, []],
    });

    this.languageData.text = this.selectedCopyRight?.text
      ? {
          ...this.selectedCopyRight.text,
        }
      : {
          [this.language]: this.form.get('text').value,
        };
  }

  fetchData() {
    /*Ponga aqui las peticiones para loas datos de Tipo REFERENCE*/
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  onSave(): void {
    this.spinner.show();
    this.updateLanguageData();
    let data = {
      ...this.form.value,
      ...this.languageData,
    };
    this.isSaving = true;
    console.log(data);

    if (!this.isEditing) {
      this.copyRightService.createCopyRight(data).subscribe(
        () => {
          this.showToastr.showSucces('Elemento creado correctamente');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinner.hide();
          this.isSaving = false;
          if (error.status == 404 || error.status == 403) {
            this.dialogRef.close();
          }
        },
      );
    } else {
      let dataOutput = {
        id: this.selectedCopyRight.id,
      };
      for (let key in data) {
        if (!this.utilsService.isObjectEquals(this.selectedCopyRight[key], data[key])) {
          dataOutput[key] = data[key];
        }
      }
      this.copyRightService.editCopyRight(dataOutput).subscribe(
        () => {
          this.showToastr.showSucces('Elemento editado correctanmete');
          this.spinner.hide();
          this.dialogRef.close(true);
        },
        (error) => {
          this.spinner.hide();
          this.isSaving = false;
          if (error.status == 404 || error.status == 403) {
            this.dialogRef.close();
          }
        },
      );
    }
  }

  //////////////////////////// UTILS FOR LANGUAGE HANDLE ///////////////////////////////////////
  updateLanguageData() {
    this.languageData.text[this.language] = this.form.get('text').value;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
}
