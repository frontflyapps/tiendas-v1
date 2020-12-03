import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn } from '@angular/forms';
import { ImagePickerConf } from 'ngp-image-picker';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { BussinessService } from '../../../services/business/business.service';
import { RegionsService } from '../../../services/regions/regions.service';
import { LoggedInUserService } from './../../../../../core/services/loggedInUser/logged-in-user.service';
import { UserService } from '../../../services/user/user.service';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';

@Component({
  selector: 'app-create-business',
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.scss'],
})
export class CreateBusinessComponent implements OnInit {
  basicForm: FormGroup;
  locationForm: FormGroup;
  sellerForm: FormGroup;
  formPass: FormGroup;
  allProvinces: any[] = [];
  municipalities: any[] = [];
  allMunicipalities: any[] = [];
  isBasicInfoChanged = false;
  passwordType = 'password';
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
  allPerson: any[] = [];

  constructor(
    private fb: FormBuilder,
    private regionService: RegionsService,
    private loggedInUserService: LoggedInUserService,
    private businessService: BussinessService,
    private spinner: NgxSpinnerService,
    private showToastr: ShowToastrService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private router: Router,
    public userService: UserService,
  ) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Crear un negocio', true);
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
      // PersonId: [null, [Validators.required]],
    });

    this.locationForm = this.fb.group({
      ProvinceId: [null, [Validators.required]],
      CountryId: [59, [Validators.required]],
      MunicipalityId: [null, [Validators.required]],
      address: [null, [Validators.required]],
      longitude: [null, []],
      latitude: [null, []],
    });

    this.formPass = this.fb.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        repeatPassword: [null, [Validators.required]],
      },
      { validator: this.passwordsMatch.bind(this) },
    );

    this.sellerForm = this.fb.group({
      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      username: [null, [Validators.required]],
      ci: [null, []],
      birthday: [null, []],
      password: this.formPass,
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

    this.userService.getAllUsers({ order: 'name', limit: 10000, offset: 0 }).subscribe(
      (data) => {
        this.allPerson = data.data;
      },
      (e) => {
        //catch error
      },
    );
  }

  onCreateBusiness() {
    this.spinner.show();
    let person = this.sellerForm.value;
    person.password = this.formPass.get('password').value;
    let data = {
      business: { ...this.basicForm.value, ...this.locationForm.value },
      person: { ...person },
    };
    data.business.logo = this.imageBusiness;
    // console.log(JSON.stringify(data));
    this.businessService.createAdminBussines(data).subscribe(
      () => {
        this.showToastr.showSucces(
          this.translate.instant('Negocio creado desde la administración correctamente'),
          'Éxito',
          8000,
        );
        this.spinner.hide();
      },
      (e) => {
        this.spinner.hide();
      },
    );
  }

  passwordsMatch(fg: FormGroup): any {
    const pass = fg.controls['password'].value;
    const repeat = fg.controls['repeatPassword'].value;
    if (pass === repeat && pass && repeat && pass !== '') {
      return null;
    } else if (!pass && !repeat) {
      return null;
    } else {
      return {
        mismatch: true,
      };
    }
  }

  areEquals(a, b) {
    return a && b && a.trim() == b.trim();
  }
}
