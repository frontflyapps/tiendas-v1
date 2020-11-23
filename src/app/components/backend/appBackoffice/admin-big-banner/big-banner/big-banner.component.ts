import { BreadcrumbService } from './../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { environment } from './../../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingService } from '../../../services/settings/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { UtilsService } from './../../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from './../../../../../core/services/show-toastr/show-toastr.service';
import { ShowSnackbarService } from './../../../../../core/services/show-snackbar/show-snackbar.service';
import { ConfiguracionService } from './../../../../../core/services/config/configuracion.service';
import { ImagePickerConf } from 'ngp-image-picker';

@Component({
  selector: 'app-big-banner',
  templateUrl: './big-banner.component.html',
  styleUrls: ['./big-banner.component.scss'],
})
export class BigBannerComponent implements OnInit {
  loadImage = false;
  language = null;
  _unsubscribeAll: Subject<any>;
  languages: any[] = [];
  languageForm: FormControl;
  tags: any[] = [];
  imageUrl = environment.imageUrl;
  imageBigPromoChange = false;
  imageBigPromo = null;
  imageBigPromo2Change = false;
  imageBigPromo2 = null;
  _initialImageBanner1 = null;
  _initialImageBanner2 = null;
  show2 = true;

  imagePickerConfBanner1: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '250px',
    width: '100%',
  };

  imagePickerConfBanner2: ImagePickerConf = {
    borderRadius: '4px',
    language: 'es',
    height: '250px',
    width: '100%',
  };

  constructor(
    public utilsService: UtilsService,
    private showSnackbar: ShowSnackbarService,
    public spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private breadcrumbService: BreadcrumbService,
    private configService: ConfiguracionService,
  ) {}

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Promociones', true);
    this.configService.getValue('bigBannerPromo1').then((data) => {
      this._initialImageBanner1 = data?.image;
    });
    this.configService.getValue('bigBannerPromo2').then((data) => {
      this._initialImageBanner2 = data?.image;
    });

    // setTimeout(() => {
    //   this.show2 = true;
    // }, 250);
  }

  onImageBigPromoChange(dataUri) {
    this.imageBigPromoChange = true;
    this.imageBigPromo = dataUri;
  }
  onImageBigPromo2Change(dataUri) {
    this.imageBigPromo2Change = true;
    this.imageBigPromo2 = dataUri;
  }

  onSave() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea guardar este cambio?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.saveData()
          .then(() => {
            this.showSnackbar.showSucces('Images de pancartas del sistema cambiadas exitósamnete');
            this.spinner.hide();
          })
          .catch((error) => {
            this.spinner.hide();
          });
      }
    });
  }

  saveData() {
    const arrayPromise: Promise<any>[] = [];
    if (this.imageBigPromoChange) {
      arrayPromise.push(this.configService.setValue('bigBannerPromo1', { image: this.imageBigPromo }));
    }
    if (this.imageBigPromo2Change) {
      arrayPromise.push(this.configService.setValue('bigBannerPromo2', { image: this.imageBigPromo2 }));
    }
    return Promise.all(arrayPromise);
  }
}
