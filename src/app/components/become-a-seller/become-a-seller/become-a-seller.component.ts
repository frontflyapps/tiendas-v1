import { ShowToastrService } from '../../../core/services/show-toastr/show-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RegionsService } from '../../../core/services/regions/regions.service';
import { BusinessService } from '../../../core/services/business/business.service';
import { ImagePickerConf } from 'guachos-image-picker';
import { CUBAN_PHONE_START_5, EMAIL_REGEX } from '../../../core/classes/regex.const';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { BankService } from '../../../core/services/bank/bank.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-become-a-seller',
  templateUrl: './become-a-seller.component.html',
  styleUrls: ['./become-a-seller.component.scss'],
})
export class BecomeASellerComponent implements OnInit {
  form: FormGroup;
  basicForm: FormGroup;
  locationForm: FormGroup;
  sellerForm: FormGroup;
  firstStep: any;
  logo = environment.logoWhite;
  secondStep: any;
  thirdStep: any;
  allProvinces: any[] = [];
  municipalities: any[] = [];
  allMunicipalities: any[] = [];
  allBanks: any[] = [];
  allBranchs: any[] = [];
  branchs: any[] = [];
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

  _unsubscribeAll: Subject<any>;

  managementForm: {
    viewValue: string;
    value: boolean;
  }[] = [
    {
      viewValue: 'Estatal (Empresa, Pymes, Mixta, CNA, CPA, CCS, PDL)',
      value: false,
    },
    {
      viewValue: 'No estatal (Pymes, TCP, CCS, PDL)',
      value: true,
    },
  ];
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private regionService: RegionsService,
    private loggedInUserService: LoggedInUserService,
    private businessService: BusinessService,
    public utilsService: UtilsService,
    private bankService: BankService,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private translate: TranslateService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    if (localStorage.getItem('bs_image')) {
      this.imageBusiness = localStorage.getItem('bs_image');
    }
    this.firstStep = JSON.parse(localStorage.getItem('bs_step_one'));
    this.secondStep = JSON.parse(localStorage.getItem('bs_step_two'));
    this.thirdStep = JSON.parse(localStorage.getItem('bs_step_three'));
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((document.body.scrollTop > 64 ||
      document.documentElement.scrollTop > 64) && window.innerWidth > 937) {
      document.getElementById('questions-bar').classList.add('fixed-bar');
    } else {
      document.getElementById('questions-bar').classList.remove('fixed-bar');
    }
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
      name: [this.firstStep ? this.firstStep.name : null, [Validators.required]],
      description: [this.firstStep ? this.firstStep.description : null],

      socialObject: [this.firstStep ? this.firstStep.socialObject : null, [Validators.required]],
      selfEmployed: [this.firstStep ? this.firstStep.selfEmployed : null, [Validators.required]],
      reeup: [this.firstStep ? this.firstStep.reeup : null],
      nit: [this.firstStep ? this.firstStep.nit : null],
      commercialRegister: [this.firstStep ? this.firstStep.commercialRegister : null],

      cellphone: [this.firstStep ? this.firstStep.cellphone : null, [Validators.required, Validators.pattern(CUBAN_PHONE_START_5)]],
      telephone: [this.firstStep ? this.firstStep.telephone : null, []],
      email: [this.firstStep ? this.firstStep.email : null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],

      managerName: [this.firstStep ? this.firstStep.managerName : null, [Validators.required]],
      managerLastName: [this.firstStep ? this.firstStep.managerLastName : null, [Validators.required]],
      managerCharge: [this.firstStep ? this.firstStep.managerCharge : null, [Validators.required]],
      managerIdentification: [this.firstStep ? this.firstStep.managerIdentification : null, [Validators.required]],
      managerPhone: [this.firstStep ? this.firstStep.managerPhone : null, [Validators.required]],
      managerEmail: [this.firstStep ? this.firstStep.managerEmail : null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      // managerCharacter: [this.firstStep ? this.firstStep.managerCharacter : null, [Validators.required]],
      // managerDesignation: [this.firstStep ? this.firstStep.managerDesignation : null],
      // managerDate: [this.firstStep ? this.firstStep.managerDate : null, [Validators.required]],
      // managerDictatedBy: [this.firstStep ? this.firstStep.managerDictatedBy : null],

      bankLicense: [this.firstStep ? this.firstStep.bankLicense : null, [Validators.required]],
      bankCommercialRegister: [this.firstStep ? this.firstStep.bankCommercialRegister : null, [Validators.required]],

      card26: [this.firstStep ? this.firstStep.card26 : null],
      UsdBankId: [this.firstStep ? this.firstStep.UsdBankId : null],
      usdBankBranch: [this.firstStep ? this.firstStep.usdBankBranch : null, [Validators.maxLength(4)]],

      cupCard: [this.firstStep ? this.firstStep.cupCard : null],
      CupBankId: [this.firstStep ? this.firstStep.CupBankId : null],
      cupBankBranch: [this.firstStep ? this.firstStep.cupBankBranch : null, [Validators.maxLength(4)]],
    });

    this.locationForm = this.fb.group({
      CountryId: [this.secondStep ? this.secondStep.CountryId : 59, [Validators.required]],
      ProvinceId: [this.secondStep ? this.secondStep.ProvinceId : null, [Validators.required]],
      MunicipalityId: [this.secondStep ? this.secondStep.MunicipalityId : null, [Validators.required]],
      address: [this.secondStep ? this.secondStep.address : null, [Validators.required]],
      longitude: [this.secondStep ? this.secondStep.longitude : null, []],
      latitude: [this.secondStep ? this.secondStep.latitude : null, []],
    });

    this.sellerForm = this.fb.group({
      name: [this.loggedInUser?.name, [Validators.required]],
      lastName: [this.loggedInUser?.lastName, [Validators.required]],
      birthday: [this.thirdStep ? this.thirdStep.birthday : null, [Validators.required]],
      ci: [this.thirdStep ? this.thirdStep.ci : null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    });

    this.basicForm.controls['cupBankBranch'].valueChanges.subscribe((data) => {
      console.log(this.basicForm);
    });
  }

  onImageChange(dataUri) {
    this.imageBusinessChange = true;
    this.imageBusiness = dataUri;
  }

  compare(f1: any, f2: any) {
    return f1?.name === f2?.name;
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
    this.bankService.getAllBank().subscribe((data) => {
      this.allBanks = [...data.data];
    });
  }

  // getBranchsByBank(id: any) {
  //   let data = { businessId: id };
  //   this.bankService.getAllBranch(data).subscribe((data) => {
  //     this.allBranchs = [...data.data];
  //   });
  // }

  saveStepOne() {
    localStorage.setItem('bs_image', this.imageBusiness);
    localStorage.setItem('bs_step_one', JSON.stringify(this.basicForm.value));
  }

  saveStepTwo() {
    localStorage.setItem('bs_image', this.imageBusiness);
    localStorage.setItem('bs_step_one', JSON.stringify(this.basicForm.value));
    localStorage.setItem('bs_step_two', JSON.stringify(this.locationForm.value));
  }

  onCreateBusiness() {
    this.spinner.show();
    let data = {
      business: { ...this.basicForm.value, ...this.locationForm.value },
      owner: { ...this.sellerForm.value },
    };
    // data.business.card = data.owner.card;
    data.business.logo = this.imageBusiness;
    // delete data.owner.card;
    data.business.CupBankId = this.basicForm.controls['CupBankId'].value.id;
    data.business.UsdBankId = this.basicForm.controls['UsdBankId'].value.id;

    this.businessService.createBussines(data).subscribe(
      () => {
        this.showToastr.showSucces(
          this.translate.instant(
            'Su solicitud de negocio ha sido creada exitosamente, nos pondremos en contacto con usted para comunicarle el proceso de aprobacion',
          ),
          'Éxito',
          8000,
        );
        localStorage.removeItem('bs_image');
        localStorage.removeItem('bs_step_one');
        localStorage.removeItem('bs_step_two');
        localStorage.removeItem('bs_step_three');
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
