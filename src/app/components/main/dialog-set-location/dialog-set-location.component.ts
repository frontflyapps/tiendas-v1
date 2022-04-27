import { Component, Inject, HostListener, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { LocationService } from '../../../core/services/location/location.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { type } from 'os';

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
  public province: FormControl = new FormControl(null, [Validators.required]);
  public municipality: FormControl = new FormControl(null, [Validators.required]);
  public allProvinces: any[];
  public allMunicipalityByProvince: any[];
  private dataResult: any = {};

  compare(f1: any, f2: any) {
    return f1?.name === f2?.name;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogSetLocationComponent>,
    private locationService: LocationService,
  ) {
    this.initSubsLocation();
    if (this.province.value) {
      this.getProvinceById(this.province.value.id);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.innerWidth = window.innerWidth;
    this.applyStyle = this.innerWidth <= 600;
  }

  ngOnInit(): void {
    this.subsForm();
    this.onResize('event');
    this.getProvinces();
  }

  initSubsLocation() {
    this.locationService.location$.subscribe((newLocation) => {
      this.setLocationData(newLocation);
    });
  }

  setLocationData(locationOnLocalStorage) {
    this.municipality.setValue(locationOnLocalStorage.municipality);
    this.province.setValue(locationOnLocalStorage.province);
  }

  subsForm() {
    this.province.valueChanges.subscribe((value) => {
      this.getProvinceById(value.id);
    });
  }

  public setDataResponse() {
    this.dataResult.municipality = this.municipality.value;
    this.dataResult.province = this.province.value;
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

  private getProvinceById(id) {
    this.locationService.getProvinceById(id).subscribe((responseData) => {
      this.allMunicipalityByProvince = responseData.data.Municipalities;
    });
  }

  private getMunicipalityById(id) {
    this.locationService.getMunicipalityId(id).subscribe((responseData) => {
      this.allMunicipalityByProvince = responseData.data;
    });
  }
}
