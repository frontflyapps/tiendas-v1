import { IPagination } from '../../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OffertService {
  url = environment.apiUrl + 'offer';
  urlId = environment.apiUrl + 'offer/:offertId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createOffert(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editOffert(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':offertId', data.id), data, this.httpOptions);
  }

  removeOffert(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':offertId', data.id), this.httpOptions).toPromise();
  }

  getAllOffer(query?: IPagination, params?: any) {
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
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getOffert(data: any): Observable<any> {
    if (data.constructor == Object) {
      return this.httpClient.get<any>(this.urlId.replace(':offertId', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':offertId', data + ''), this.httpOptions);
    }
  }
}
