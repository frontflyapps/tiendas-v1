import { IPagination } from '../../classes/pagination.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TaxesShippingService {
  urlTax = environment.apiUrl + 'tax';
  urlTaxId = environment.apiUrl + 'tax/:taxId';
  urlShipping = environment.apiUrl + 'shipping';
  urlShippingId = environment.apiUrl + 'shipping/:shippingId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {
  }

  createTax(body: any): Observable<any> {
    return this.httpClient.post<any>(this.urlTax, body);
  }

  editTax(data) {
    return this.httpClient.post<any>(this.urlTax, data, this.httpOptions);
  }

  removeTax(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlTaxId.replace(':taxId', data.id), this.httpOptions).toPromise();
  }

  getAllTaxes(query?: IPagination, params?: any) {
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
    }
    return this.httpClient.get<any>(this.urlTax, { params: httpParams });
  }

  getTax(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlTaxId.replace(':taxId', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlTaxId.replace(':taxId', data.id), this.httpOptions);
    }
  }

  ///////Shipping///////
  createShipping(body: any): Observable<any> {
    return this.httpClient.post<any>(this.urlShipping, body);
  }

  editShipping(data) {
    return this.httpClient.patch<any>(this.urlShippingId.replace(':shippingId', data.id), data, this.httpOptions);
  }

  removeShipping(data): Promise<any> {
    return this.httpClient
      .delete<any>(this.urlShippingId.replace(':shippingId', data.id), this.httpOptions)
      .toPromise();
  }

  getAllShippings(query?: IPagination, params?: any) {
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
    }
    return this.httpClient.get<any>(this.urlShipping, { params: httpParams });
  }

  getShippinginCheckout(body: any): Observable<any> {
    return this.httpClient.post<any>(this.urlShipping + '/checkout-data', body);
  }

  getShipping(data) {
    if (typeof data === 'number') {
      return this.httpClient.get<any>(this.urlShippingId.replace(':shippingId', data.toFixed()), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlShippingId.replace(':shippingId', data.id), this.httpOptions);
    }
  }
}
