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
import { CUBAN_PHONE_START_5, EMAIL_REGEX, NIT, PHONE } from '../../../core/classes/regex.const';
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
  ownerForm: FormGroup;
  checkboxForm: FormGroup;
  firstStep: any;
  ownerInfo: any;
  logo = environment.logoWhite;
  imageUrl = environment.imageUrl;
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
  imageSelected = false;
  loggedInUser = undefined;

  _unsubscribeAll: Subject<any>;

  managementForm: {
    viewValue: string;
    id: string;
    value: boolean;
  }[] = [
    {
      viewValue: 'Estatal (Empresa, Pymes, Mixta, CNA, CPA, CCS, PDL)',
      id: 'estatal',
      value: false,
    },
    {
      viewValue: 'No estatal (Pymes, TCP, CCS, PDL)',
      id: 'pymes',
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
      if (this.imageSelected !== undefined) {

      }
    }
    this.firstStep = JSON.parse(localStorage.getItem('bs_step_one'));
    this.ownerInfo = JSON.parse(localStorage.getItem('ownerInfo'));

    this.buildForm();
    this.fetchDaTa();
    console.log(this.ownerInfo);
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
    this.basicForm.valueChanges.subscribe((data) => {
      this.isBasicInfoChanged = true;
    });
  }

  buildForm() {
    this.basicForm = this.fb.group({
      name: [this.firstStep ? this.firstStep.name : null, [Validators.required]],
      description: [this.firstStep ? this.firstStep.description : null],

      selfEmployed: [this.firstStep ? this.firstStep.selfEmployed : null, [Validators.required]],
      nit: [this.firstStep ? this.firstStep.nit : null, [Validators.pattern(NIT)]],
      reuup: [this.firstStep ? this.firstStep?.reuup : null, [Validators.pattern(NIT)]],

      cellphone: [this.firstStep ? this.firstStep.cellphone : null, [Validators.required, Validators.pattern(PHONE)]],
      telephone: [this.firstStep ? this.firstStep.telephone : null, [Validators.pattern(PHONE)]],
      email: [this.firstStep ? this.firstStep.email : null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
      CountryId: [this.firstStep ? this.firstStep.CountryId : 59, [Validators.required]],

      // OwnerInfo
      owner: this.fb.group({
        name: [this.ownerInfo?.name, [Validators.required]],
        lastName: [this.ownerInfo?.lastName, [Validators.required]],
        charge: [this.ownerInfo ? this.ownerInfo.charge : null, [Validators.required]],
        phone: [this.ownerInfo ? this.ownerInfo.phone : null, [Validators.required, Validators.pattern(PHONE)]],
        email: [this.ownerInfo ? this.ownerInfo.email : null, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
        ci: [this.ownerInfo ? this.ownerInfo.ci : null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      }),

      // locationForm
      ProvinceId: [this.firstStep ? this.firstStep.ProvinceId : null, [Validators.required]],
      MunicipalityId: [this.firstStep ? this.firstStep.MunicipalityId : null, [Validators.required]],
      address: [this.firstStep ? this.firstStep.address : null, [Validators.required]],
      longitude: [this.firstStep ? this.firstStep.longitude : null, []],
      latitude: [this.firstStep ? this.firstStep.latitude : null, []],
      checked: [false, [Validators.required]]
    });

    console.log(this.basicForm.value);
  }

  onImageChange(dataUri) {
    this.imageBusinessChange = true;
    this.imageBusiness = dataUri;
    this.imageSelected = true;
  }

  compare(f1: any, f2: any) {
    return f1?.name === f2?.name;
  }

  onSelectProvince(provinceId) {
    this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
    this.basicForm.get('MunicipalityId').setValue(null);
  }

  fetchDaTa() {
    this.regionService.getProvinces().subscribe((data) => {
      this.allProvinces = data.data;
    });
    this.regionService.getMunicipalities().subscribe((data) => {
      this.allMunicipalities = data.data;
      this.municipalities = this.allMunicipalities.filter(
        (item) => item.ProvinceId == this.basicForm.get('ProvinceId').value,
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

  selectSelfEmployed(event) {
    console.log(event);
  }

  saveInfo() {
    localStorage.setItem('bs_image', this.imageBusiness);
    localStorage.setItem('bs_step_one', JSON.stringify(this.basicForm.value));
    localStorage.setItem('ownerInfo', JSON.stringify(this.basicForm.get('owner').value));
  }

  fillLoggedInfo() {
    this.basicForm.get('owner').get('name').setValue(this.loggedInUser?.name);
    this.basicForm.get('owner').get('lastName').setValue(this.loggedInUser?.lastName);
    this.basicForm.get('owner').get('phone').setValue(this.loggedInUser?.phone);
    this.basicForm.get('owner').get('ci').setValue(this.loggedInUser?.ci);
    this.basicForm.get('owner').get('email').setValue(this.loggedInUser?.email);
    this.basicForm.get('owner').get('charge').setValue(null);
  }

  onCreateBusiness() {
    this.saveInfo();
    this.spinner.show();
    console.log(this.ownerInfo);
    let data = {
      business: { ...this.basicForm.value },
      owner: { ...this.basicForm.get('owner').value },
    };
    // data.business.card = data.owner.card;
    data.business.logo = this.imageBusiness;
    // delete data.owner.card;

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
}
