import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { BreadcrumbService } from './../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { BussinessService } from './../../../services/business/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ImagePickerConf } from 'ngp-image-picker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowSnackbarService } from 'src/app/core/services/show-snackbar/show-snackbar.service';
import { environment } from 'src/environments/environment';
import { RegionsService } from '../../../services/regions/regions.service';
import { ConfirmationDialogComponent } from '../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-business-details',
  templateUrl: './admin-business-details.component.html',
  styleUrls: ['./admin-business-details.component.scss'],
})
export class AdminBusinessDetailsComponent implements OnInit {
  hideSecret = 'password';
  form: FormGroup;
  moneyForm: FormGroup;
  locationForm: FormGroup;
  selectedBusiness: any;
  loggedInUser: any;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '50%',
    language: 'es',
    width: '150px',
    height: '150px',
  };
  imageBusinessChange = false;
  imageBusiness = undefined;
  showData = false;
  imageUrl: string;
  canEditBusiness = false;
  allCountries: any[] = [];
  allProvinces: any[] = [];
  allMunicipalities: any[] = [];
  municipalities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    private businessService: BussinessService,
    private fb: FormBuilder,
    private showSnackbar: ShowSnackbarService,
    private breadcrumbService: BreadcrumbService,
    public loggedInUserService: LoggedInUserService,
    private regionService: RegionsService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.imageUrl = environment.imageUrl;
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.spinner.show();
    this.showData = false;
    this.route.params.subscribe((data) => {
      this.businessService.getBussines(data.businessId).subscribe((result) => {
        this.selectedBusiness = result.data;
        console.log('AdminBusinessDetailsComponent -> this.selectedBusiness', this.selectedBusiness);
        this.canEditBusiness = this.loggedInUser.id == this.selectedBusiness.OwnerId;
        this.buildForm();
        this.showData = true;
        this.spinner.hide();
        this.fetchData();
      });
    });
  }

  ngOnInit(): void {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Negocio', false, '/backend/business');
    this.breadcrumbService.setBreadcrumd('Editar', false, null);
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: [{ value: this.selectedBusiness?.name, disabled: !this.canEditBusiness }, [Validators.required]],
      cellphone: [{ value: this.selectedBusiness?.cellphone, disabled: !this.canEditBusiness }, [Validators.required]],
      email: [
        { value: this.selectedBusiness?.email, disabled: !this.canEditBusiness },
        [Validators.required, Validators.email],
      ],
      telephone: [{ value: this.selectedBusiness?.telephone, disabled: !this.canEditBusiness }, []],
      description: [
        { value: this.selectedBusiness?.description, disabled: !this.canEditBusiness },
        [Validators.required],
      ],
      address: [{ value: this.selectedBusiness?.address, disabled: !this.canEditBusiness }, [Validators.required]],
    });
    this.moneyForm = this.fb.group({
      card: [{ value: this.selectedBusiness?.card, disabled: !this.canEditBusiness }, [Validators.required]],
    });

    this.locationForm = this.fb.group({
      ProvinceId: [
        { value: this.selectedBusiness?.ProvinceId, disabled: !this.canEditBusiness },
        [Validators.required],
      ],
      MunicipalityId: [
        { value: this.selectedBusiness?.MunicipalityId, disabled: !this.canEditBusiness },
        [Validators.required],
      ],
      CountryId: [{ value: this.selectedBusiness?.CountryId, disabled: !this.canEditBusiness }, [Validators.required]],
    });
  }

  fetchData() {
    this.regionService.getAllCountries({ limit: 100000, offset: 0 }).subscribe(
      (data) => {
        this.allCountries = data.data.filter((item) => item.name.es != undefined);
        this.allCountries = this.allCountries.sort(function (a, b) {
          if (a.name['es'] > b.name['es']) {
            return 1;
          } else if (a.name['es'] < b.name['es']) {
            return -1;
          } else {
            return 0;
          }
        });
      },
      (error) => {},
    );
    this.regionService.getProvinces().subscribe((data) => {
      this.allProvinces = data.data;
    });
    this.regionService.getMunicipalities().subscribe((data) => {
      this.allMunicipalities = data.data;
      this.municipalities = this.allMunicipalities.filter(
        (item) => item.ProvinceId == this.locationForm?.get('ProvinceId').value,
      );
    });
  }

  onSelectProvince(provinceId) {
    this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    this.locationForm?.get('MunicipalityId').setValue(null);
  }

  showSecret() {
    if (this.hideSecret == 'password') {
      this.hideSecret = 'text';
    } else {
      this.hideSecret = 'password';
    }
  }

  onImageChange(dataUri) {
    this.imageBusinessChange = true;
    this.imageBusiness = dataUri;
  }

  onSaveBasicInfo() {
    this.spinner.show();
    let data = { ...this.form.value };
    if (this.imageBusinessChange) {
      data.logo = this.imageBusiness;
    }
    data.id = this.selectedBusiness.id;
    console.log(data);
    this.businessService.editBussines(data).subscribe(
      () => {
        this.showSnackbar.showSucces('Negocio editado con éxito');
        window.location.reload();
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      },
    );
  }

  public compareById(val1, val2) {
    return val1 && val2 && val1 == val2;
  }

  onSaveSecondForm() {
    this.spinner.show();
    const data = { ...this.moneyForm.value, ...this.locationForm.value };
    data.id = this.selectedBusiness.id;
    // console.log(data);
    this.businessService.editBussines(data).subscribe(
      () => {
        this.showSnackbar.showSucces('Negocio editado con éxito');
        window.location.reload();
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      },
    );
  }

  onEnableBusiness() {
    let text = '';
    const databody = {
      id: this.selectedBusiness.id,
      status: 'approved',
    };
    let logoutAction = false;

    text = ` <blockquote style=" background: #f4f2ff !important;
        border-radius: 3px !important;
        border-left: 5px solid blue;
        margin: 30px 0 !important;
        padding: 30px !important;">
                      <p  style="font-size: 17px;
                      line-height: 30px;
                      font-weight: 400;" > Estás seguro de habilitar esta solicitud de negocio?.</p>
                      <p  style="font-size: 17px;
                      line-height: 30px;
                      font-weight: 400;" >Una vez realizada esta acción, se le habilitará al usuario del mismo, el rol de <strong>owner</strong> y podrá
                       subir productos a la plataforma.</p>
                    </blockquote>`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      maxWidth: '100vw',
      data: {
        title: 'Confirmación',
        question: text,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();
        this.businessService.makeStatusBussines(databody).subscribe(
          () => {
            this.showSnackbar.showSucces('Negocio editado con éxito');
            if (logoutAction) {
              localStorage.clear();
              this.loggedInUserService.$loggedInUserUpdated.next(null);
              this.router.navigate(['']);
            }
            window.location.reload();
            this.spinner.hide();
          },
          (error) => {
            console.log(error);
            this.spinner.hide();
          },
        );
      }
    });
  }

  onDisabledBusiness() {
    let text = '';
    const databody = {
      id: this.selectedBusiness.id,
      status: 'disabled',
    };
    let logoutAction = false;
    text = ` <blockquote style=" background: #f4f2ff !important;
    border-radius: 3px !important;
    border-left: 5px solid #e53935;
    margin: 30px 0 !important;
    padding: 30px !important;">
                  <p  style="font-size: 17px;
                  line-height: 30px;
                  font-weight: 400;" > Estás seguro de deshabilitar este negocio?.</p>
                  <p  style="font-size: 17px;
                  line-height: 30px;
                  font-weight: 400;" >Una vez realizada esta acción, el usuario no podrá subir más productos al sistema y se le retirará
                  el rol de <strong>owner</strong> </p>
                </blockquote>`;
    if (this.loggedInUserService.isOwnerOfABussines(this.selectedBusiness.OwnerId)) {
      logoutAction = true;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      maxWidth: '100vw',
      data: {
        title: 'Confirmación',
        question: text,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.spinner.show();
        this.businessService.makeStatusBussines(databody).subscribe(
          () => {
            this.showSnackbar.showSucces('Negocio editado con éxito');
            if (logoutAction) {
              localStorage.clear();
              this.loggedInUserService.$loggedInUserUpdated.next(null);
              this.router.navigate(['']);
            }
            window.location.reload();
            this.spinner.hide();
          },
          (error) => {
            console.log(error);
            this.spinner.hide();
          },
        );
      }
    });
  }
}
