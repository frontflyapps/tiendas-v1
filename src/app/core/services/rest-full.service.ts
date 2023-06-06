import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from '../classes/pagination.class';

@Injectable()
export abstract class RestFullService<T> {
  url = '';
  urlId = '';
  urlExport = '';

  httpParams = new HttpParams();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      responseType: 'blob' as 'json',
    }),
  };

  private httpClient: HttpClient;

  public get http(): HttpClient {
    if (!this.httpClient) {
      this.httpClient = this.injector.get(HttpClient);
    }
    return this.httpClient;
  }

  protected constructor(private injector: Injector) {
  }

  create(body: any): Observable<T> {
    return this.http.post<T>(this.url, body);
  }

  edit(id, body) {
    let httpOptions;
    if (body?.paymentData?.gateway === 'come2pay') {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'return_url': body?.paymentData?.returnUrl,
        }),
      };
    }
    return this.http.patch<any>(
      this.urlId.replace(':id', id),
      body,
      body?.paymentData?.gateway === 'come2pay' ? httpOptions : this.httpOptions
    );
  }

  remove(item) {
    return this.http.delete(
      this.urlId.replace(':id', item.id),
      this.httpOptions
    );
  }

  get(id) {
    return this.http.get<any>(this.urlId.replace(':id', id));
  }

  getAll(query?: IPagination, params?: any): any {
    this.deleteKeysHttpParams();
    if (query) {
      console.log('dfdfff', query)
      this.httpParams = this.httpParams.append('limit', query?.limit ? query?.limit.toString() : '10');
      this.httpParams = this.httpParams.append(
        'offset',
        query.offset ? query.offset.toString() : 0
      );
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          this.httpParams = this.httpParams.append(
            item,
            '%' + query.filter.filterText + '%'
          );
        });
      }

      if (query.order) {
        this.httpParams = this.httpParams.append('order', query.order);
      }
    } else {
      this.httpParams = this.httpParams.set('limit', '0');
      this.httpParams = this.httpParams.set('offset', '0');
      console.log('dfdfff')
    }

    if (params) {
      console.log(params)
      const keys = Object.keys(params);
      keys.forEach((key) => {
        if (params[key].type === 'range-date') {
          if (params[key].stringFilter.includes('[$gte]')) {
            this.httpParams = this.httpParams.append(
              params[key].stringFilter,
              // UtilsService.buildInitialDate(params[key].value).toISOString()
              params[key].value
            );
          } else {
            this.httpParams = this.httpParams.append(
              params[key].stringFilter,
              // UtilsService.buildEndDate(params[key].value).toISOString()
              params[key].value
            );
          }
        } else if (
          params[key].type === 'date' ||
          params[key].type === 'number' ||
          params[key].type === 'select' ||
          params[key].type === 'autocomplete' ||
          params[key].type === 'boolean'
        ) {
          this.httpParams = this.httpParams.append(
            params[key].stringFilter,
            params[key].value
          );
        } else {
          this.httpParams = this.httpParams.append(
            params[key].stringFilter,
            '%' + params[key].value + '%'
          );
        }
      });
    }
    return this.http.get<any>(this.url, { params: this.httpParams });
  }

  getAllAll(params?: any) {
    this.deleteKeysHttpParams();
    this.httpParams = this.httpParams.set('limit', '0');
    this.httpParams = this.httpParams.set('offset', '0');
    if (params) {
      if (params.name) {
        this.httpParams = this.httpParams.append(
          'filter[$and][name][$like]',
          '%' + params.name + '%'
        );
      }
    }
    return this.http.get<any>(this.url, { params: this.httpParams });
  }

  ExportAllAll(params?: any) {
    this.deleteKeysHttpParams();
    this.httpParams = this.httpParams.set('limit', '0');
    this.httpParams = this.httpParams.set('offset', '0');
    if (params) {
      const keys = Object.keys(params);
      keys.forEach((key) => {
        if (params[key].type === 'range-date') {
          if (params[key].stringFilter.includes('[$gte]')) {
            this.httpParams = this.httpParams.append(
              params[key].stringFilter,
              // UtilsService.buildInitialDate(params[key].value).toISOString()
              params[key].value
            );
          } else {
            this.httpParams = this.httpParams.append(
              params[key].stringFilter,
              // UtilsService.buildEndDate(params[key].value).toISOString()
              params[key].value
            );
          }
        } else if (
          params[key].type === 'date' ||
          params[key].type === 'number' ||
          params[key].type === 'select' ||
          params[key].type === 'autocomplete' ||
          params[key].type === 'boolean'
        ) {
          this.httpParams = this.httpParams.append(
            params[key].stringFilter,
            params[key].value
          );
        } else {
          this.httpParams = this.httpParams.append(
            params[key].stringFilter,
            '%' + params[key].value + '%'
          );
        }
      });
    }
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get<any>(this.urlExport, { params: this.httpParams });
  }

  deleteKeysHttpParams() {
    const keys = this.httpParams.keys();
    if (keys) {
      keys.forEach((key) => {
        this.httpParams = this.httpParams.delete(key);
      });
    }
  }
}
