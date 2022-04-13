import { IPagination } from '../../classes/pagination.class';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  url = environment.apiUrl + 'currency';
  urlBusinessStructure = environment.apiUrl + 'business-structure';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {
  }

  getCurrencys(query?: IPagination, params?: any) {
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
      if (params.currencyDestination) {
        httpParams = httpParams.set('filter[$and][currencyDestination]', params.currencyDestination);
      }
      if (params.currencyTarget) {
        httpParams = httpParams.set('filter[$and][currencyTarget]', params.currencyTarget);
      }
      if (params.BusinessId) {
        httpParams = httpParams.set('filter[$and][BusinessId]', params.BusinessId);
      }
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  /**
   * Obtain custom fields of a business according to cartId
   */
  getCustomFields(cartId: any){
    let httpParams = new HttpParams();
    httpParams = httpParams.append('cartId', cartId.cartId);
    return  this.httpClient.get<any>(this.urlBusinessStructure, { params: httpParams });
  }
  // getCustomFields(){
  //   return  this.httpClient.get<any>(this.urlBusinessStructure);
  // }
}
