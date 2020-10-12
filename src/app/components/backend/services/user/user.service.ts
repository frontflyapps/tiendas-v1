import { IPagination } from './../../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiUrl + 'person';
  urlId = environment.apiUrl + 'person/:personId';
  urlMessenger = environment.apiUrl + 'messenger';
  urlMessengerId = environment.apiUrl + 'messenger/:Id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {};
  }

  createUser(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  changePassUser(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url + '/change-pass', body);
  }

  editUser(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':personId', data.id), data, this.httpOptions);
  }

  removeUser(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':personId', data.id), this.httpOptions).toPromise();
  }

  getAllUsers(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      let httpParams = new HttpParams();
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
      if (params.role) {
        httpParams = httpParams.append('role', params.role);
      }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getUser(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlId.replace(':personId', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':personId', data.id), this.httpOptions);
    }
  }

  //////////////////////////CURD MESSENGER///////////////////////////////

  createMEssenger(body: any): Observable<any> {
    return this.httpClient.post<any>(this.urlMessenger, body);
  }

  editMEssenger(data) {
    return this.httpClient.patch<any>(this.urlMessengerId.replace(':Id', data.id), data, this.httpOptions);
  }

  removeMEssenger(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlMessengerId.replace(':Id', data.id), this.httpOptions).toPromise();
  }

  getAllMEssengers(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      let httpParams = new HttpParams();
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
      if (params.role) {
        httpParams = httpParams.append('role', params.role);
      }
    }
    return this.httpClient.get<any>(this.urlMessenger, { params: httpParams });
  }

  getMEssenger(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlMessengerId.replace(':Id', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlMessengerId.replace(':Id', data.id), this.httpOptions);
    }
  }
}
