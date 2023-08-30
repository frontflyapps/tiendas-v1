import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { UploadFileService } from './upload-file.service';
import { environment } from '../../../../../environments/environment';
import { UploadTypesEnum } from '../upload-types.enum';
import { FORMAT_TYPES, FORMAT_ACCEPTED } from '../../../../core/classes/format-types.const';
import { ShowToastrService } from '../../../../core/services/show-toastr/show-toastr.service';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;
  fileUploadedChange = false;
  type = undefined;
  fkModel = undefined;
  fkId = undefined;
  fileLoaded = undefined;
  showFileLoaded = false;
  showUploadingProgress = true;
  imageUrl = environment.imageUrl;
  metaDataUploading = { progress: 20.0, fileName: '', uuid: '', status: 'pending' };
  _unsub = new Subject<any>();
  isValidToUpload: boolean;

  formatTypes = FORMAT_TYPES;
  formatAccepted = FORMAT_ACCEPTED;

  allType: any[] = [
    {
      type: 'Archivo local',
      id: 'localMedia',
    },
    // {
    //   type: 'Video de alguna red social (youtube,facebook,instagram)',
    //   id: 'externalMedia',
    // },
  ];
  formData: any = new FormData();
  fileFor: any;

  formatTypeName: any;
  fileUploadedSuccess = false;
  @Output() $fileUploaded: EventEmitter<any> = new EventEmitter();

  constructor(
    private showToastr: ShowToastrService,
    private uploadingService: UploadFileService,
    public spinner: NgxSpinnerService,
  ) {
    this.fileFor = {
      product: () => this.uploadProductFile(this.formData),
      dataSheet: () => this.uploadDataSheetFile(this.formData),
      prescriptionImage: () => this.uploadPrescriptionImageFile(this.formData),
      arj: () => this.uploadingService.createFile(this.formData),
      circular: () => this.uploadingService.createCircularFile(this.formData),
      versat: () => this.uploadingService.createVersatFile(this.formData),
    };
  }

  @Input() set _type(value: UploadTypesEnum) {
    if (value) {
      this.type = value;
    }
  }

  @Input() set _fkModel(value) {
    if (value) {
      this.fkModel = value;
    }
  }

  @Input() set _fkId(value) {
    if (value) {
      this.fkId = value;
    }
  }

  @Input() set _file(value) {
    if (value) {
      this.fileLoaded = value;
    }
  }

  ngOnInit(): void {
    // @ts-ignore
    this.form = new UntypedFormGroup({
      type: new FormControl(null, [Validators.required]),
      file: new FormControl(null, [Validators.required]),
      formatType: new FormControl(null, [Validators.required]),
      link: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
        ),
      ]),
    });
    this.subscriptionsForm();
  }

  subscriptionsForm() {
    this.form.get('formatType')
      .valueChanges
      .subscribe(change => {
        this.formatTypeName = this.formatTypes.find((item) => item.id === change);
      });
  }

  ngOnDestroy() {
    this._unsub.next(true);
    this._unsub.complete();
  }

  onSelectionChange(event) {
    this.form.get('file').setValue('');
  }

  handleFileSelect(event) {
    this.isValidToUpload = true;
    const file = (event.target as HTMLInputElement).files[0];
    const typesSelected = this.formatAccepted[this.form.get('formatType').value].split(',');
    const foundByName = typesSelected.find((element) => {
      return file.name.includes(element.trim());
    });

    if (!file) {
      return;
    }
    if (file.type.split('/')[0] === 'video' && !typesSelected.includes('video/*')) {
      this.isValidToUpload = false;
      this.showToastr.showError('El archivo seleccionado no está permitdo, solo se puede subir archivos de tipo' + typesSelected);
      return;
    }
    if (file.type.split('/')[0] === 'image' && !typesSelected.includes('image/*')) {
      this.isValidToUpload = false;
      this.showToastr.showError('El archivo seleccionado no está permitdo, solo se puede subir archivos de tipo' + typesSelected);
      return;
    }
    // if (foundByName === undefined && file.type.split('/')[0] !== 'video' && file.type.split('/')[0] !== 'image') {
    //   this.isValidToUpload = false;
    //   this.showToastr.showError('El archivo seleccionado no está permitdo, solo se puede subir archivos de tipo ' + typesSelected);
    //   return;
    // }

    this.form.patchValue({
      file: file,
    });

    this.form.get('file').updateValueAndValidity();
    this.showFileLoaded = false;
    this.fileLoaded = undefined;
    this.fileUploadedChange = true;
  }

  computedSize() {
    let file: File = this.form.get('file').value;
    if (file) {
      let size = file.size;
      if (size < 1024) {
        return file.size + 'Bytes';
      }
      size = size / 1024;
      if (size < 1024) {
        return size.toFixed(2) + 'Kb';
      }
      size = size / 1024;
      if (size < 1024) {
        return size.toFixed(2) + 'Mb';
      }
      return (size / 1024).toFixed(2) + 'Gb';
    } else {
      return 0;
    }
  }

  async onUploadFile() {
    let data = this.form.get('file').value;
    this.formData.append('file', data);
    this.fileUploadedSuccess = true;

    this.metaDataUploading = { progress: 0.0, fileName: data.name, uuid: Date.now() + '', status: 'pending' };
    this.showUploadingProgress = true;
    this.fileUploadedChange = false;

    console.log(this.type);
    console.log(this.fileFor);

    this.fileFor[this.type](this.formData)
      .pipe(takeUntil(this._unsub))
      .subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              this.metaDataUploading.status = 'start';
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              this.metaDataUploading.status = 'uploading';
              break;
            case HttpEventType.UploadProgress:
              this.metaDataUploading.status = 'uploading';
              let progress = Math.round((event.loaded / event.total) * 100);
              this.metaDataUploading.progress = progress;
              break;
            case HttpEventType.Response:
              this.metaDataUploading.status = 'completed';
              this.fileLoaded = event.body;
              this.fileUploadedSuccess = true;

              console.log('info subida 111', { url: this.fileLoaded, ...this.form.value });
              this.$fileUploaded.next({ url: this.fileLoaded, success: true, ...this.form.value });
              this.formData = new FormData();
              // this.showFileLoaded = true;

              // this.showUploadingProgress = false;
              // this.spinner.show();
              // let xInput = document.getElementById('file-uploader-input') as HTMLInputElement;
              // xInput.value = '';
              // this.uploadingService.editFile({ ...this.fileLoaded, fkModel: this.fkModel, fkId: this.fkId }).subscribe(
              //   (response: any) => {
              //     this.fileLoaded = response.data;
              //     this.$fileUploaded.next({ ...this.fileLoaded });
              //     this.spinner.hide();
              //   },
              //   (e) => {
              //     this.spinner.hide();
              //   },
              // );

              break;
          }
        },
        (error) => {
          this.$fileUploaded.next({ url: '', success: false });
          this.formData = new FormData();
          this.metaDataUploading.status = 'error';
          this.fileUploadedSuccess = false;
        },
      );
  }

  wait(delay = 1000): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(true);
      }, delay);
    });
  }

  onUploadLink() {
    let data = { type: this.form.get('type').value, link: this.form.get('link').value };
    this.spinner.show();
    this.uploadingService.createFileLink(data).subscribe(
      (response1) => {
        this.fileLoaded = response1.data;
        this.uploadingService.editFile({ ...this.fileLoaded, fkModel: this.fkModel, fkId: this.fkId }).subscribe(
          (response: any) => {
            this.fileLoaded = response.data;
            this.$fileUploaded.next({ ...this.fileLoaded });
            this.spinner.hide();
          },
          (e) => {
            this.spinner.hide();
          },
        );
      },
      () => {
        this.spinner.hide();
      },
    );
  }

  uploadProductFile(dataToUpload) {
    return this.uploadingService.createProductFile(dataToUpload, this.fkId);
  }

  uploadDataSheetFile(dataToUpload) {
    return this.uploadingService.createDataSheetFile(dataToUpload, this.fkId);
  }

  uploadPrescriptionImageFile(dataToUpload) {
    return this.uploadingService.createPrescriptionImageFile(dataToUpload, this.fkId);
  }
  uploadARJFile(dataToUpload) {
    return;
  }
  uploadFile(dataToUpload) {
    return;
  }
}
