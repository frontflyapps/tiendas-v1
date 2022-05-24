import { Injectable } from '@angular/core';
import { IPagination } from '../../../core/classes/pagination.class';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  url = environment.apiUrl + 'business/front';
  urlId = environment.apiUrl + 'business/front/:businessId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) { }

  getAllBussiness(query?: IPagination, params?: any) {
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
    httpParams = httpParams.set('filter[$and][status]', 'approved');
    if (params) {
      if (params.name) {
        httpParams = httpParams.set('filter[$and][name][$like]', '%' + params.name.toString() + '%');
      }

      // if (params.status) {
      //   if (params.status.constructor != Array) {
      //     httpParams = httpParams.set('filter[$and][status]', params.status.toString());
      //   }
      //   if (params.status.constructor == Array && params.status.length) {
      //     if (params.status.length == 1) {
      //       httpParams = httpParams.set('filter[$and][status]', params.status[0].toString());
      //     } else {
      //       params.status.map((item) => {
      //         httpParams = httpParams.append('filter[$and][status]', item.toString());
      //       });
      //     }
      //   }
      // }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getBussines(data: any): Observable<any> {
    if (data.constructor === Object) {
      return this.httpClient.get<any>(this.urlId.replace(':businessId', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':businessId', data + ''), this.httpOptions);
    }
  }

}
