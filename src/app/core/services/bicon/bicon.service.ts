import { IPagination } from '../../classes/pagination.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BiconService {
  url = environment.apiUrl + 'bicon';
  urlId = environment.apiUrl + 'bicon/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createBicon(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editBicon(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeBicon(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllBicons(query?: IPagination, params?: any) {
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
      if (params.isActive !== undefined) {
        httpParams = httpParams.set('filter[$and][isActive]', params.isActive ? '1' : '0');
      }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getBicon(data: any): Observable<any> {
    if (data.constructor === Object) {
      return this.httpClient.get<any>(this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}
