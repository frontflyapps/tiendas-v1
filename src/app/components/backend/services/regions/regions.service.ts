import { IPagination } from './../../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  url = environment.apiUrl + 'region';
  urlId = environment.apiUrl + 'region/:regionId';
  urlCountry = environment.apiUrl + 'country';
  urlCountryId = environment.apiUrl + 'country/:countryId';
  urlCity = environment.apiUrl + 'city';
  urlCityId = environment.apiUrl + 'city/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createRegion(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editRegion(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':regionId', data.id), data, this.httpOptions);
  }

  removeRegion(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':regionId', data.id), this.httpOptions).toPromise();
  }

  getAllRegions(query?: IPagination, params?: any) {
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
    console.log(httpParams);
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getRegion(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlId.replace(':regionId', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':regionId', data.id), this.httpOptions);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  getAllCountries(query?: IPagination, params?: any) {
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

    return this.httpClient.get<any>(this.urlCountry, { params: httpParams });
  }

  getCountry(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlCountryId.replace(':countryId', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlCountryId.replace(':countryId', data.id), this.httpOptions);
    }
  }
  //////////////////////////////////CITIES///////////////////////////////////
  getAllCities(query?: IPagination, params?: any) {
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
      if (params.CountryId) {
        httpParams = httpParams.set('filter[$and][CountryId]', params.CountryId);
      }
    }

    return this.httpClient.get<any>(this.urlCity, { params: httpParams });
  }

  getCity(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlCityId.replace(':id', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlCityId.replace(':id', data.id), this.httpOptions);
    }
  }

  createCity(body: any): Observable<any> {
    return this.httpClient.post<any>(this.urlCity, body);
  }

  editCity(data) {
    return this.httpClient.patch<any>(this.urlCityId.replace(':id', data.id), data, this.httpOptions);
  }

  removeCity(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlCityId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getProvinces(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'province');
  }

  getMunicipalities(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + 'municipality');
  }
}
