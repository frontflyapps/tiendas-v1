import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UtilsService }                                                  from '../../../core/services/utils/utils.service';

@Component({
  selector   : 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls  : ['./upload-file.component.scss'],
})
export class UploadFileComponent {

  @Input() label     = 'Seleccione el fichero';
  @Input() fileTypes = 'image/*';
  @Input() multiple  = false;

  @Output() onUploadFile: EventEmitter<any> = new EventEmitter<any>();

  limitGB                = 1024 * 1024 * 1024;
  limitMB                = 1024 * 1024;
  limitKB                = 1024;
  allMyFiles: any[]      = [];
  allFiltersFiles: any[] = [];

  uuid: any;
  FileId: any;
  files    = [];
  urlImage = 'data:type/example;base64,';

  uploadSubscription: any;
  showLoadFileCard = true;
  loading          = false;
  finishUpload     = false;
  error            = false;

  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;

  constructor(private utilsService: UtilsService) {
  }

  // STEP 1
  onClick() {
    const fileUpload    = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      this.files = [];
      // tslint:disable-next-line: prefer-for-of
      if (fileUpload.files.length === 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < fileUpload.files.length; index++) {
          const file = fileUpload.files[index];
          this.files.push({
            data      : file,
            inProgress: false,
            progress  : 0,
          });
        }
      } else {
        if (this.multiple) {
          for (let index = 0; index < fileUpload.files.length; index++) {
            const file = fileUpload.files[index];
            this.files.push({
              data      : file,
              inProgress: false,
              progress  : 0,
            });
          }
        } else {
          const file    = fileUpload.files[0];
          this.files[0] = {
            data      : file,
            inProgress: false,
            progress  : 0,
          };
        }

      }
      this.onSave();
      this.showLoadFileCard = false;
    };
    fileUpload.click();
  }

  onSave(): void {
    let data = [];
    if (this.multiple) {
      this.files.forEach((file => {
        data.push({
          file: file,
          uuid: this.utilsService.generateUuid(),
        });
      }));
    } else {
      data.push({
        file: this.files[0],
        uuid: this.utilsService.generateUuid(),
      });
    }

    this.onUploadFile.emit(data);
  }

  getSize(size) {
    if (size > this.limitGB) {
      return (size / 1073741824).toFixed(2) + 'Gb';
    } else if (size > this.limitMB) {
      return (size / this.limitMB).toFixed(2) + 'Mb';
    } else {
      return (size / 1024).toFixed(2) + 'Kb';
    }
  }
}
