import { Component, OnDestroy, OnInit } from '@angular/core';
import { BusinessService } from '../../shared/services/business.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shops-list',
  templateUrl: './shops-list.component.html',
  styleUrls: ['./shops-list.component.scss']
})
export class ShopsListComponent implements OnInit, OnDestroy {
  apiURL = environment.apiUrl;
  businessName: FormControl;
  _unsubscribeAll: Subject<any>;
  allBusiness: any;
  initialPage = 9
  query = {
    total: 0,
    limit: this.initialPage,
    offset: 0,
    page: 0,
    order: '-id',
  };
  pageSizeOptions: number[] = [this.initialPage, 25, 100, 1000];

  constructor(private businessService: BusinessService, private fb: FormBuilder) {
    this.businessName = new FormControl(null, []);
    this._unsubscribeAll = new Subject<any>();
  }

  ngOnInit(): void {
    this.fetchBusiness();
  }

  fetchBusiness(params?: any) {
    this.businessService.getAllBussiness(this.query, params).pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.query.total = data.meta.pagination.total;
      this.allBusiness = data.data;
    })
  }

  onSearchBusiness() {
    let params = {
      name: this.businessName.value
    };
    this.fetchBusiness(params);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  OnPaginatorChange(event: any){
    if (event) {
      this.query.limit = event.pageSize || this.initialPage;
      this.query.offset = event.pageIndex * event.pageSize;
      this.query.page = event.pageIndex;
    } else {
      this.query.limit = this.initialPage;
      this.query.offset = 0;
      this.query.page = 1;
    }
    this.fetchBusiness();
  }

}