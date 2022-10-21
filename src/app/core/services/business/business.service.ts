import { IPagination } from '../../classes/pagination.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  url = environment.apiUrl + 'business';
  urlId = environment.apiUrl + 'business/:businessId';

  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createBussines(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  createAdminBussines(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url + '/admin', body);
  }

  editBussines(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':businessId', data.id), data, this.httpOptions);
  }

  removeBussines(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':businessId', data.id), this.httpOptions).toPromise();
  }

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
    if (params) {
      if (params.status && params.status.constructor != Array) {
        httpParams = httpParams.set('filter[$and][status]', params.status);
      } else if (params.status) {
        params.status.map((item) => {
          httpParams = httpParams.append('filter[$and][status][$in]', item);
        });
      }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getBusiness(data: any): Observable<any> {
    if (data.constructor === Object) {
      return this.httpClient.get<any>(this.urlId.replace(':businessId', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':businessId', data + ''), this.httpOptions);
    }
  }

  makeStatusBusiness(data) {
    return this.httpClient.post<any>(this.url + `/${data.id}/status-change`, data);
  }
}
