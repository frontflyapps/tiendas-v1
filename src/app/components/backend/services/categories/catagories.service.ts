import { IPagination } from './../../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  url = environment.apiUrl + 'category';
  urlId = environment.apiUrl + 'category/:categoryId';
  urlBrand = environment.apiUrl + 'brand';
  urlBrandId = environment.apiUrl + 'brand/:brandId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createCategory(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  getMenu(): Observable<any> {
    return this.httpClient.get<any>(this.url + '/menu');
  }

  editCategory(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':categoryId', data.id), data, this.httpOptions);
  }

  removeCategory(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':categoryId', data.id), this.httpOptions).toPromise();
  }

  getAllCategories(query?: IPagination, params?: any) {
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
      if (params.ParentCategoryId) {
        httpParams = httpParams.set('filter[$and][ParentCategoryId]', params.ParentCategoryId);
      }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getRootsCategories() {
    let httpParams = new HttpParams();
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getCategory(data) {
    if (data.constructor != Object) {
      return this.httpClient.get<any>(this.urlId.replace(':categoryId', data + ''), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':categoryId', data.id), this.httpOptions);
    }
  }
  ///////Brand///////
  createBrand(body: any): Observable<any> {
    return this.httpClient.post<any>(this.urlBrand, body);
  }

  editBrand(data) {
    return this.httpClient.patch<any>(this.urlBrandId.replace(':brandId', data.id), data, this.httpOptions);
  }

  removeBrand(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlBrandId.replace(':brandId', data.id), this.httpOptions).toPromise();
  }

  getAllBrands(query?: IPagination, params?: any) {
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
    }
    return this.httpClient.get<any>(this.urlBrand, { params: httpParams });
  }

  getBrand(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlBrandId.replace(':brandId', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlBrandId.replace(':brandId', data.id), this.httpOptions);
    }
  }
}
