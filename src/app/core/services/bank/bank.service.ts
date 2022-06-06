import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../../classes/pagination.class';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  urlBank = environment.apiUrl + 'bank';
  urlBranch = environment.apiUrl + 'sucursal';

  constructor(private httpClient: HttpClient) {}

  getAllBank(query?: IPagination, params?: any) {
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
      if (params.status && params.status.constructor != Array) {
        httpParams = httpParams.set('filter[$and][status]', params.status);
      } else if (params.status) {
        params.status.map((item) => {
          httpParams = httpParams.append('filter[$and][status][$in]', item);
        });
      }
    }
    return this.httpClient.get<any>(this.urlBank, { params: httpParams });
  }

  getAllBranch(params?: any) {
    let httpParams = new HttpParams();

    if (params) {
      if(params.businessId){
        httpParams = httpParams.set('filter[$and][BankId]', params.businessId);
      }
      if (params.status && params.status.constructor != Array) {
        httpParams = httpParams.set('filter[$and][status]', params.status);
      } else if (params.status) {
        params.status.map((item) => {
          httpParams = httpParams.append('filter[$and][status][$in]', item);
        });
      }
    }
    return this.httpClient.get<any>(this.urlBranch, { params: httpParams });
  }
}
