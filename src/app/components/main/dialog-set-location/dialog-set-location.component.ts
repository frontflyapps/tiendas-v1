import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LocationService } from '../../../core/services/location/location.service';
import { debounceTime, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { BusinessService } from 'src/app/core/services/business/business.service';
import { Console } from 'console';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-set-location',
  templateUrl: './dialog-set-location.component.html',
  styleUrls: ['./dialog-set-location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DialogSetLocationComponent implements OnInit, OnDestroy {
  _unsubscribeAll: Subject<any>;

  innerWidth: any;
  applyStyle = false;
  public locationForm: UntypedFormGroup;
  storageLocation: any;
  // public province: FormControl = new FormControl(null, [Validators.required]);
  // public municipality: FormControl = new FormControl(null, []);
  // public business: FormControl = new FormControl(null, []);
  public allProvinces: any[];
  public allMunicipalityByProvince: any[];
  public allBusiness: any[];
  filteredOptions: Observable<string[]>;
  filteredProvinces: Observable<string[]>;
  filteredMunicipalities: Observable<string[]>;
  private dataResult: any = {};

  compare(f1: any, f2: any) {
    return f1?.name === f2?.name;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogSetLocationComponent>,
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    public translate: TranslateService
  ) {
    this.storageLocation = data;
    this.getProvinces();

    // this.initSubsLocation();

    // this.filteredOptions = this.locationForm.get('business').valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(250),
    //   map((name) => (name ? this._filterCountriesCode(name) : this.allBusiness?.slice())),
    // );
    // this.initLocation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  ngOnInit(): void {
    this.initForm();
    this.subsForm();
    this.onResize('event');
    // this.getProvinces();
  }

  private initForm() {
    this.locationForm = this.fb.group({
      province: [
        this.storageLocation ? this.storageLocation?.provinceData : null,
        [Validators.required, DialogSetLocationComponent.valueSelected()],
      ],
      municipality: [
        this.storageLocation ? this.storageLocation?.municipalityData : null,
        [DialogSetLocationComponent.valueSelected()],
      ],
    });
    /*--Cuanto se esta editando--*/
    if (this.locationForm.get('province').value) {
      this.getProvincesById(this.locationForm.get('province').value.id);
    }
    // if (this.locationForm.get('municipality').value) {
    //   this.getBusiness(this.locationForm.get('municipality').value.id, null);
    // }
    // if (!this.locationForm.get('municipality').value && this.locationForm.get('province').value) {
    //   this.getBusiness(null, this.locationForm.get('province').value.id);
    // }
    /*--------------------------*/
    this.filteredProvinces = this.locationForm.get('province').valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      map((name) => (name ? this._filterProvinces(name) : this.allProvinces?.slice())),
    );
    this.filteredMunicipalities = this.locationForm.get('municipality').valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      map((name) => (name ? this._filterMunicipalities(name) : this.allMunicipalityByProvince?.slice())),
    );
  }

  private static valueSelected(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (typeof c === 'object' && c.value?.id) {
        return null;
      } else {
        return { match: true };
      }
    };
  }

  private _filterProvinces(province: string): any[] {
    if (typeof province === 'string') {
      const filterValue = province.toLowerCase();
      return this.allProvinces.filter((province: any) => province.name.toLowerCase().includes(filterValue));
    }
  }

  private _filterMunicipalities(municipality: string): any[] {
    if (typeof municipality === 'string') {
      const filterValue = municipality.toLowerCase();
      return this.allMunicipalityByProvince.filter((municipality: any) =>
        municipality.name.toLowerCase().includes(filterValue),
      );
    }
  }

  private _filterBusiness(business: string): any[] {
    if (typeof business === 'string') {
      const filterValue = business.toLowerCase();
      return this.allBusiness.filter((business: any) => business.name.toLowerCase().includes(filterValue));
    }
  }

  public displayFn(ele: any): string {
    return ele?.name ? ele.name : '';
  }

  // initLocation() {
  //   if (this.storageLocation) {
  //     this.locationForm.get('province').setValue(this.storageLocation.provinceData);
  //     this.locationForm.get('municipality').setValue(this.storageLocation.municiplity);
  //     this.locationForm.get('business').setValue(this.storageLocation.businessData);
  //   }
  // }

  // initSubsLocation() {
  //   this.locationService.location$.subscribe((newLocation) => {
  //     this.setLocationData(newLocation);
  //   });
  // }

  // setLocationData(locationOnLocalStorage) {
  //   this.province.setValue(locationOnLocalStorage.province);
  //   this.municipality.setValue(locationOnLocalStorage.municipality);
  //   this.business.setValue(locationOnLocalStorage.business);
  //   console.log(this.municipality.value, this.province.value, this.business.value);
  // }

  subsForm() {
    this.locationForm.get('province').valueChanges.subscribe((value) => {
      if (value?.id) {
        this.getProvincesById(value?.id);
        // this.getBusiness(null, value?.id);
      }
    });
    // this.locationForm.get('municipality').valueChanges.subscribe((value) => {
    //   if (value?.id) this.getBusiness(value?.id, null);
    // });
  }

  public setDataResponse() {
    this.dataResult.municipality = this.locationForm.get('municipality').value;
    this.dataResult.province = this.locationForm.get('province').value;
    // this.dataResult.business = this.locationForm.get('business').value;
    return this.dataResult;
  }

  onClose() {
    this.dialogRef.close(this.setDataResponse());
  }

  ngOnDestroy(): void {
    if (this._unsubscribeAll) {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this._unsubscribeAll.unsubscribe();
    }
  }

  private getProvinces() {
    this.locationService.getProvince().subscribe((responseData) => {
      this.allProvinces = responseData.data;
    });
  }

  private getProvincesById(id) {
    this.locationService.getProvinceById(id).subscribe((responseData) => {
      this.allMunicipalityByProvince = responseData.data.Municipalities;
    });
  }

  // private getMunicipalityById(id) {
  //   this.locationService.getMunicipalityId(id).subscribe((responseData) => {
  //     this.allMunicipalityByProvince = responseData.data;
  //   });
  // }

  // private getBusiness(municipalityId: number, provinceId: number) {
  //   let params = { municipalityId: null, provinceId: null };
  //   this.allBusiness = [];
  //   if (municipalityId) {
  //     params.municipalityId = municipalityId;
  //   }
  //   if (provinceId) {
  //     params.provinceId = provinceId;
  //   }
  //   this.businessService.getAllPublicBusiness(params).subscribe((responseData) => {
  //     this.allBusiness = responseData.data;
  //   });
  // }

  public municipalityChange() {
    // this.locationForm.get('business').setValue(null);
  }
  public provinceChange() {
    this.locationForm.get('municipality').setValue(null);
    // this.locationForm.get('business').setValue(null);
  }
  clearProvince() {
    this.locationForm.get('province').setValue(null);
    this.locationForm.get('municipality').setValue(null);
    // this.locationForm.get('business').setValue(null);
  }
  clearMunicipality() {
    this.locationForm.get('municipality').setValue(null);
    // this.locationForm.get('business').setValue(null);
  }
  clearBusiness() {
    // this.locationForm.get('business').setValue(null);
  }
}
