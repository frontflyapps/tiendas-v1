import { ShowToastrService } from './../../../core/services/show-toastr/show-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ImagePickerConf } from 'ngp-image-picker';
import { RegionsService } from '../../backend/services/regions/regions.service';
import { BussinessService } from '../../backend/services/business/business.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-a-seller',
  templateUrl: './become-a-seller.component.html',
  styleUrls: ['./become-a-seller.component.scss'],
})
export class BecomeASellerComponent implements OnInit {
  basicForm: FormGroup;
  locationForm: FormGroup;
  sellerForm: FormGroup;
  allProvinces: any[] = [];
  municipalities: any[] = [];
  allMunicipalities: any[] = [];
  isBasicInfoChanged = false;
  startDate = new Date(1985, 1, 1);
  // zoom = 12;
  // center: google.maps.LatLngLiteral;
  // options: google.maps.MapOptions = {
  //   mapTypeId: 'hybrid',
  //   zoomControl: false,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: false,
  //   maxZoom: 15,
  //   minZoom: 8,
  // };

  imagePickerConf: ImagePickerConf = {
    borderRadius: '50%',
    language: 'es',
    width: '150px',
    height: '150px',
  };
  imageBusinessChange = false;
  imageBusiness = undefined;
  loggedInUser = undefined;

  constructor(
    private fb: FormBuilder,
    private regionService: RegionsService,
    private loggedInUserService: LoggedInUserService,
    private businessService: BussinessService,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private translate: TranslateService,
    private router: Router,
  ) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.fetchDaTa();
    this.buildForm();
    this.basicForm.valueChanges.subscribe((data) => {
      this.isBasicInfoChanged = true;
    });
  }

  buildForm() {
    this.basicForm = this.fb.group({
      name: [null, [Validators.required]],
      cellphone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telephone: [null, []],
      description: [null, [Validators.required]],
    });

    this.locationForm = this.fb.group({
      ProvinceId: [null, [Validators.required]],
      CountryId: [59, [Validators.required]],
      MunicipalityId: [null, [Validators.required]],
      address: [null, [Validators.required]],
      longitude: [null, []],
      latitude: [null, []],
    });

    this.sellerForm = this.fb.group({
      name: [this.loggedInUser?.name, [Validators.required]],
      lastName: [this.loggedInUser?.lastName, [Validators.required]],
      birthday: [null, [Validators.required]],
      ci: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      card: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
    });
  }

  onImageChange(dataUri) {
    this.imageBusinessChange = true;
    this.imageBusiness = dataUri;
  }

  onSelectProvince(provinceId) {
    this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    this.locationForm.get('MunicipalityId').setValue(null);
  }

  fetchDaTa() {
    this.regionService.getProvinces().subscribe((data) => {
      this.allProvinces = data.data;
    });
    this.regionService.getMunicipalities().subscribe((data) => {
      this.allMunicipalities = data.data;
      this.municipalities = this.allMunicipalities.filter(
        (item) => item.ProvinceId == this.locationForm.get('ProvinceId').value,
      );
    });
  }

  onCreateBusiness() {
    this.spinner.show();
    let data = {
      business: { ...this.basicForm.value, ...this.locationForm.value },
      owner: { ...this.sellerForm.value },
    };
    data.business.card = data.owner.card;
    data.business.logo = this.imageBusiness;
    delete data.owner.card;
    // console.log(JSON.stringify(data));
    this.businessService.createBussines(data).subscribe(
      () => {
        this.showToastr.showSucces(
          this.translate.instant(
            'Su solicitud de negocio ha sido procesado exitosamente, nos pondremos en contacto con usted para aceptar la solicitud y habilitarle el comercio',
          ),
          'Éxito',
          8000,
        );
        this.spinner.hide();
        this.router.navigate(['']);
      },
      (e) => {
        this.spinner.hide();
      },
    );
  }
}
