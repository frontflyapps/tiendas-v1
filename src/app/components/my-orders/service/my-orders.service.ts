import { IPagination } from './../../../core/classes/pagination.class';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MyOrdersService {
  urlPayment = environment.apiUrl + 'payment';
  urlPaymentId = environment.apiUrl + 'payment/:id';
  httpOptions = {};
  public $orderItemsUpdated: Subject<any> = new Subject();F

  constructor(private httpClient: HttpClient) {
  }

  ////////////////////////////PAYMENT///////////////////////////////////////////

  getAllPayment(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (params) {
      if (params.ProductId) {
        httpParams = httpParams.set('filter[$and][ProductId]', params.ProductId);
      }
      if (params.CountryId) {
        httpParams = httpParams.set('filter[$and][CountryId]', params.CountryId);
      }
      if (params.startDate && params.endDate) {
        httpParams = httpParams.set('filter[$and][createdAt][$gte]', params.startDate);
        httpParams = httpParams.set('filter[$and][createdAt][$lte]', params.endDate);
      }
      if (params.status && params.status.constructor != Array) {
        httpParams = httpParams.set('filter[$and][status]', params.status);
      } else if (params.status) {
        params.status.map((item) => {
          httpParams = httpParams.append('filter[$and][status][$in]', item);
        });
      }
    }

    return this.httpClient.get<any>(this.urlPayment, { params: httpParams });
  }

  getPayment(data) {
    if (data.constructor == Object) {
      return this.httpClient.get<any>(this.urlPaymentId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlPaymentId.replace(':id', data + ''), this.httpOptions);
    }
  }

  editPayment(data) {
    return this.httpClient.patch<any>(this.urlPaymentId.replace(':id', data.id), data, this.httpOptions);
  }


}
