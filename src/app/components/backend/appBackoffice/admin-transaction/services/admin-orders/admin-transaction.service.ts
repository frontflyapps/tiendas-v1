import { environment } from './../../../../../../../environments/environment';
import { IPagination } from './../../../../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PdfGenService } from 'src/app/core/services/get-pdf/pdf-gen.service';

@Injectable()
export class AdminTransactionService {
  urlPayment = environment.apiUrl + 'admin/payment';
  urlPaymentId = environment.apiUrl + 'admin/payment/:id';
  urlDelivery = environment.apiUrl + 'delivery';
  urlCancelAdminOrder = environment.apiUrl + 'admin/payment/:id/cancel';

  constructor(private httpClient: HttpClient, private pdfGenService: PdfGenService) {}

  ///////////////////////////////ADMIN PAYMENT///////////////////////////////////
  getAllOrders(query?: IPagination, params?: any) {
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
      if (params.ProductId && params.ProductId.constructor != Array) {
        httpParams = httpParams.set('filter[$and][Product][id]', params.ProductId);
      }
      if (params.ProductId && params.ProductId.constructor == Array) {
        params.ProductId.map((item) => {
          httpParams = httpParams.append('filter[$and][Product][id]', item);
        });
      }
      if (params.CountryId) {
        httpParams = httpParams.set('filter[$and][CountryId]', params.CountryId);
      }
      if (params.BusinessId) {
        httpParams = httpParams.set('filter[$and][BusinessId]', params.BusinessId);
      }
      if (params.startDate && params.endDate) {
        httpParams = httpParams.set('filter[$and][createdAt][$gte]', params.startDate);
        httpParams = httpParams.set('filter[$and][createdAt][$lte]', params.endDate);
      }
      if (params.status && params.status.constructor != Array) {
        httpParams = httpParams.set('filter[$and][status]', params.status);
      } else if (params.status) {
        params.status.map((item) => {
          httpParams = httpParams.append('filter[$and][status][$in]', item);
        });
      }
      if (params.onDelivery != undefined) {
        httpParams = httpParams.set('filter[$and][onDelivery]', params.onDelivery);
      }
      if (params.order) {
        httpParams = httpParams.set('filter[$and][order][$like]', '%' + params.order + '%');
      }
    }

    return this.httpClient.get<any>(this.urlPayment, { params: httpParams });
  }

  getOrder(data) {
    if (data.constructor === Object) {
      return this.httpClient.get<any>(this.urlPaymentId.replace(':id', data.id));
    } else {
      return this.httpClient.get<any>(this.urlPaymentId.replace(':id', data + ''));
    }
  }

  getAllDeliveries(query?: IPagination, params?: any) {
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
      if (params.ProductId && params.ProductId.constructor != Array) {
        httpParams = httpParams.set('filter[$and][Product][id]', params.ProductId);
      }
      if (params.ProductId && params.ProductId.constructor == Array) {
        params.ProductId.map((item) => {
          httpParams = httpParams.append('filter[$and][Product][id]', item);
        });
      }
      if (params.CountryId) {
        httpParams = httpParams.set('filter[$and][Country][id]', params.CountryId);
      }
      if (params.BusinessId) {
        httpParams = httpParams.set('filter[$and][BusinessId]', params.BusinessId);
      }
      if (params.startDate && params.endDate) {
        httpParams = httpParams.set('filter[$and][createdAt][$gte]', params.startDate);
        httpParams = httpParams.set('filter[$and][createdAt][$lte]', params.endDate);
      }
      if (params.status && params.status.constructor != Array) {
        httpParams = httpParams.set('filter[$and][status]', params.status);
      } else if (params.status) {
        params.status.map((item) => {
          httpParams = httpParams.append('filter[$and][status][$in]', item);
        });
      }
      if (params.order) {
        httpParams = httpParams.set('filter[$and][order][$like]', '%' + params.order + '%');
      }
    }

    return this.httpClient.get<any>(this.urlDelivery, { params: httpParams });
  }

  getDelivery(data) {
    if (data.constructor === Object) {
      return this.httpClient.get<any>(this.urlDelivery + `/${data.id}`);
    } else {
      return this.httpClient.get<any>(this.urlDelivery + `/${data}`);
    }
  }

  updateDelivery(data) {
    return this.httpClient.patch<any>(this.urlDelivery + `/${data.id}`, data);
  }

  public setDeliveryConfirmedOrders(data): Observable<any> {
    return this.httpClient.post<any>(this.urlDelivery, data);
  }

  public setAsDeliveredPayment(data): Observable<any> {
    return this.httpClient.post<any>(this.urlDelivery + '/set-as-delivered', data);
  }

  public cancellOrder(data): Observable<any> {
    return this.httpClient.patch<any>(this.urlCancelAdminOrder.replace(':id', data.id), data);
  }

  public getVoucher(order) {
    console.log('AdminTransactionService -> getVoucher -> order', order);
    const urlDownload = environment.apiUrl + 'payment/' + order.id + '/voucher';
    this.httpClient
      .get(urlDownload)
      .toPromise()
      .then((data: any) => {
        if (data.OK == true) {
          this.pdfGenService.genReservationVoucher(order);
        }
      })
      .catch((e) => {});
  }
}
