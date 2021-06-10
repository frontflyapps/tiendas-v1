import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IPagination } from 'src/app/core/classes/pagination.class';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { RegionsService } from 'src/app/core/services/regions/regions.service';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { MyOrdersService } from '../service/my-orders.service';

@Component({
    selector: 'app-edit-order',
    templateUrl: './edit-order.component.html',
    styleUrls: ['./edit-order.component.scss'],
  })
export class EditOrderComponent implements OnInit{
    language: any;
    allCountries: any[] = [];
    allProvinces: any[] = [];
    allMunicipalities: any[] = [];
    municipalities: any[] = [];
    order: any;
    form: FormGroup;
    onlyCubanPeople = true;
    private applyStyle: boolean;

    public compareById(val1, val2) {
        return val1 && val2 && val1 == val2;
      }

    queryCountries: IPagination = {
        limit: 1000,
        total: 0,
        offset: 0,
        order: 'name',
        page: 1,
        filter: { filterText: '', properties: [] },
    };  

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private spinner: NgxSpinnerService,
        private showToastr: ShowToastrService,
        public loggedInUserService: LoggedInUserService,
        public utilsService: UtilsService,
        private regionService: RegionsService,
        private fb: FormBuilder,
        public utilsFront: UtilsService,
        private ordersService: MyOrdersService,
        public dialogRef: MatDialogRef<EditOrderComponent>,
        private translate: TranslateService,
    ){
        this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
        this.order = data.order;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event): void {
        this.applyResolution();
    }

    private applyResolution() {
        const innerWidth = window.innerWidth;
        this.applyStyle = innerWidth <= 600;
    }
    
    ngOnInit(): void {
        this.applyResolution();
        this.fetchData();
        this.createForm();
        console.log(this.order)
        
    }

    createForm(){
        this.form = this.fb.group({

            id: this.order.id,
            name: [this.order.name, [Validators.required]],
            lastName: [this.order.lastName, [Validators.required]],
            email: [this.order.email, [Validators.required, Validators.email]],
            ProvinceId: [this.order.Province.id],
            MunicipalityId: [this.order.Municipality.id],
            // ShippingBusinessId: [],
            dni: [this.order.address],
            isForCuban: [this.order.isForCuban],
            address: [this.order.address],
            address2: [this.order ? this.order.address2 : null],
            phone: [this.order.phone],
            info: [this.order.info]

        });
        this.onlyCubanPeople = this.form.get('isForCuban').value;
        if (this.onlyCubanPeople) {
            this.form
                .get('phone')
                .setValidators([
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern(/^\d+$/),
                ]);
        }
        console.log(this.form)
        this.form.valueChanges.subscribe(() => {
            console.log(this.form)
        });

    }

    onSelectProvince(provinceId) {
        // console.log('CheckoutComponent -> onSelectProvince -> provinceId', provinceId);
        // console.log('CheckoutComponent -> onSelectProvince -> this.allMunicipalities', this.allMunicipalities);
        this.municipalities = this.allMunicipalities.filter((item) => item.ProvinceId == provinceId);
        this.form.get('MunicipalityId').setValue(null);
        this.form.get('ShippingBusinessId').setValue(null);
      }

      fetchData() {
        this.regionService.getAllCountries(this.queryCountries).subscribe(
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
          (error) => {
            this.utilsService.errorHandle(error);
          },
        );
        this.regionService.getProvinces().subscribe((data) => {
          this.allProvinces = data.data;
        });
        this.regionService.getMunicipalities().subscribe((data) => {
          this.allMunicipalities = data.data;
          this.municipalities = this.allMunicipalities.filter(
            (item) => item.ProvinceId == this.form.get('ProvinceId').value,
          );
        });
      }  

      onUpdateOrder(): void {
        const data = this.form.value;
        console.log('onUpdateOrder -> data', data)
        this.ordersService.editPayment(data).subscribe(() => {
          this.showToastr.showSucces(this.translate.instant('Orden actualizada con éxito'), 'Success');
          this.showToastr.showInfo(
            'Se actualizado la orden',
            'Info',
            8000,
          );
          this.dialogRef.close(true);
        },
        (error) => {
          // this.spinner.hide();
        },
        );
      }

}