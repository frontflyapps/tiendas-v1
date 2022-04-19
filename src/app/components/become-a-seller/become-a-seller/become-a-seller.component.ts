import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RegionsService } from '../../../core/services/regions/regions.service';
import { BusinessService } from '../../../core/services/business/business.service';
import { ImagePickerConf } from 'guachos-image-picker';
import { CUBAN_PHONE_START_5, EMAIL_REGEX } from '../../../core/classes/regex.const';

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

  managementForm: {
    viewValue: string;
    value: boolean;
  }[] = [
    {
      viewValue: 'Estatal',
      value: false,
    },
    {
      viewValue: 'No estatal',
      value: true,
    },
  ];
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private regionService: RegionsService,
    private loggedInUserService: LoggedInUserService,
    private businessService: BusinessService,
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
      description: [null],

      socialObject: [null, [Validators.required]],
      selfEmployed: [null, [Validators.required]],
      reeup: [null],
      nit: [null],
      commercialRegister: [null],

      cellphone: [null, [Validators.required, Validators.pattern(CUBAN_PHONE_START_5)]],
      telephone: [null, []],
      email: [null, [Validators.required,Validators.pattern(EMAIL_REGEX)]],

      managerName: [null, [Validators.required]],
      managerCharacter: [null, [Validators.required]],
      managerDesignation: [null, [Validators.required]],
      managerDate: [null, [Validators.required]],
      managerDictatedBy: [null, [Validators.required]],

      bankLicense: [null, [Validators.required]],
      bankCommercialRegister: [null, [Validators.required]],

      card26: [null],
      usdBank: [null],
      usdBankBranch: [null],

      cupCard: [null],
      cupBank: [null],
      cupBankBranch: [null],
    });

    this.locationForm = this.fb.group({
      CountryId: [59, [Validators.required]],
      ProvinceId: [null, [Validators.required]],
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
      //card: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
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
    //data.business.card = data.owner.card;
    data.business.logo = this.imageBusiness;
    //delete data.owner.card;

    // console.log('dataaaaaaaaaaa', data);
    // return;

    this.businessService.createBussines(data).subscribe(
      () => {
        this.showToastr.showSucces(
          this.translate.instant(
            'Su solicitud de negocio ha sido creada exitosamente, nos pondremos en contacto con usted para comunicarle el proceso de aprobacion',
          ),
          'Éxito',
          8000,
        );
        this.spinner.hide();
        this.router.navigate(['']).then();
      },
      (e) => {
        this.spinner.hide();
      },
    );
  }

  temp() {
    console.log('step 1111111', this.basicForm.value);
  }
}
